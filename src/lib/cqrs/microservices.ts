/**
 * Microservices Architecture & Service Mesh Implementation
 * Enterprise Architecture 2.0 - Quantum Enhanced
 * Distributed system with intelligent service orchestration
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface ServiceDefinition {
  id: string;
  name: string;
  version: string;
  host: string;
  port: number;
  protocol: 'http' | 'grpc' | 'websocket' | 'message_queue';
  healthEndpoint?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  dependencies?: string[];
  circuitBreaker?: CircuitBreakerConfig;
  retryPolicy?: RetryPolicy;
  loadBalancing?: LoadBalancingStrategy;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
  expectedRecoveryTime?: number;
}

export interface RetryPolicy {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

export type LoadBalancingStrategy = 'round_robin' | 'weighted_round_robin' | 'least_connections' | 'random' | 'hash';

export interface ServiceInstance {
  id: string;
  serviceId: string;
  host: string;
  port: number;
  isHealthy: boolean;
  lastHealthCheck: Date;
  connectionCount: number;
  metadata?: Record<string, any>;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface ServiceResponse<T = any> {
  requestId: string;
  status: number;
  headers?: Record<string, string>;
  body?: T;
  duration: number;
  fromInstance?: string;
}

export interface ServiceMetrics {
  requestId: string;
  serviceId: string;
  instanceId: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  error?: string;
}

// Circuit Breaker Implementation
export class CircuitBreaker extends EventEmitter {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;

  constructor(
    private config: CircuitBreakerConfig,
    private serviceId: string
  ) {
    super();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        this.emit('stateChanged', { serviceId: this.serviceId, state: this.state });
      } else {
        throw new Error(`Circuit breaker is OPEN for service: ${this.serviceId}`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 3) { // Success threshold
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.emit('stateChanged', { serviceId: this.serviceId, state: this.state });
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || 
        this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.emit('stateChanged', { serviceId: this.serviceId, state: this.state });
    }
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}

// Service Registry
export class ServiceRegistry extends EventEmitter {
  private services: Map<string, ServiceDefinition> = new Map();
  private instances: Map<string, ServiceInstance[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(private healthCheckIntervalMs: number = 30000) {
    super();
    this.startHealthChecks();
  }

  registerService(service: ServiceDefinition): void {
    this.services.set(service.id, service);
    
    // Create initial instance
    const instance: ServiceInstance = {
      id: uuidv4(),
      serviceId: service.id,
      host: service.host,
      port: service.port,
      isHealthy: true,
      lastHealthCheck: new Date(),
      connectionCount: 0,
      metadata: service.metadata
    };

    if (!this.instances.has(service.id)) {
      this.instances.set(service.id, []);
    }
    this.instances.get(service.id)!.push(instance);

    this.emit('serviceRegistered', { service, instance });
  }

  unregisterService(serviceId: string): void {
    this.services.delete(serviceId);
    this.instances.delete(serviceId);
    this.emit('serviceUnregistered', { serviceId });
  }

  addInstance(serviceId: string, instance: Omit<ServiceInstance, 'id' | 'serviceId' | 'lastHealthCheck' | 'connectionCount'>): void {
    const fullInstance: ServiceInstance = {
      id: uuidv4(),
      serviceId,
      lastHealthCheck: new Date(),
      connectionCount: 0,
      ...instance
    };

    if (!this.instances.has(serviceId)) {
      this.instances.set(serviceId, []);
    }
    this.instances.get(serviceId)!.push(fullInstance);

    this.emit('instanceAdded', { serviceId, instance: fullInstance });
  }

  removeInstance(instanceId: string): void {
    for (const [serviceId, instances] of this.instances.entries()) {
      const index = instances.findIndex(inst => inst.id === instanceId);
      if (index !== -1) {
        instances.splice(index, 1);
        this.emit('instanceRemoved', { serviceId, instanceId });
        break;
      }
    }
  }

  getService(serviceId: string): ServiceDefinition | undefined {
    return this.services.get(serviceId);
  }

  getInstances(serviceId: string): ServiceInstance[] {
    return this.instances.get(serviceId) || [];
  }

  getHealthyInstances(serviceId: string): ServiceInstance[] {
    return this.getInstances(serviceId).filter(instance => instance.isHealthy);
  }

  getAllServices(): ServiceDefinition[] {
    return Array.from(this.services.values());
  }

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.healthCheckIntervalMs);
  }

  private async performHealthChecks(): Promise<void> {
    for (const [serviceId, instances] of this.instances.entries()) {
      const service = this.services.get(serviceId);
      if (!service) continue;

      for (const instance of instances) {
        try {
          const isHealthy = await this.checkInstanceHealth(instance, service);
          const wasHealthy = instance.isHealthy;
          instance.isHealthy = isHealthy;
          instance.lastHealthCheck = new Date();

          if (wasHealthy !== isHealthy) {
            this.emit('instanceHealthChanged', {
              serviceId,
              instanceId: instance.id,
              isHealthy
            });
          }
        } catch (error) {
          instance.isHealthy = false;
          instance.lastHealthCheck = new Date();
          this.emit('instanceHealthCheckFailed', {
            serviceId,
            instanceId: instance.id,
            error
          });
        }
      }
    }
  }

  private async checkInstanceHealth(instance: ServiceInstance, service: ServiceDefinition): Promise<boolean> {
    if (!service.healthEndpoint) {
      return true; // Assume healthy if no health endpoint
    }

    try {
      const response = await fetch(
        `http://${instance.host}:${instance.port}${service.healthEndpoint}`,
        { timeout: 5000 }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

// Load Balancer
export class LoadBalancer {
  private roundRobinCounters: Map<string, number> = new Map();

  selectInstance(
    instances: ServiceInstance[],
    strategy: LoadBalancingStrategy = 'round_robin',
    request?: ServiceRequest
  ): ServiceInstance | null {
    if (instances.length === 0) {
      return null;
    }

    switch (strategy) {
      case 'round_robin':
        return this.roundRobin(instances);
      case 'weighted_round_robin':
        return this.weightedRoundRobin(instances);
      case 'least_connections':
        return this.leastConnections(instances);
      case 'random':
        return this.random(instances);
      case 'hash':
        return this.hash(instances, request);
      default:
        return this.roundRobin(instances);
    }
  }

  private roundRobin(instances: ServiceInstance[]): ServiceInstance {
    const serviceId = instances[0].serviceId;
    const counter = this.roundRobinCounters.get(serviceId) || 0;
    const selectedInstance = instances[counter % instances.length];
    this.roundRobinCounters.set(serviceId, counter + 1);
    return selectedInstance;
  }

  private weightedRoundRobin(instances: ServiceInstance[]): ServiceInstance {
    // Simple implementation - in reality, weights would come from instance metadata
    const weights = instances.map(() => 1); // Equal weights for now
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < instances.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return instances[i];
      }
    }

    return instances[instances.length - 1];
  }

  private leastConnections(instances: ServiceInstance[]): ServiceInstance {
    return instances.reduce((min, current) => 
      current.connectionCount < min.connectionCount ? current : min
    );
  }

  private random(instances: ServiceInstance[]): ServiceInstance {
    return instances[Math.floor(Math.random() * instances.length)];
  }

  private hash(instances: ServiceInstance[], request?: ServiceRequest): ServiceInstance {
    if (!request) {
      return this.random(instances);
    }

    const hash = this.simpleHash(request.id);
    return instances[hash % instances.length];
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// Service Mesh Client
export class ServiceMeshClient extends EventEmitter {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private loadBalancer = new LoadBalancer();
  private metrics: ServiceMetrics[] = [];

  constructor(private registry: ServiceRegistry) {
    super();
  }

  async request<T = any>(request: ServiceRequest): Promise<ServiceResponse<T>> {
    const startTime = Date.now();
    const service = this.registry.getService(request.serviceId);
    
    if (!service) {
      throw new Error(`Service not found: ${request.serviceId}`);
    }

    const healthyInstances = this.registry.getHealthyInstances(request.serviceId);
    if (healthyInstances.length === 0) {
      throw new Error(`No healthy instances available for service: ${request.serviceId}`);
    }

    const instance = this.loadBalancer.selectInstance(
      healthyInstances,
      service.loadBalancing,
      request
    );

    if (!instance) {
      throw new Error(`Failed to select instance for service: ${request.serviceId}`);
    }

    // Get or create circuit breaker
    const circuitBreaker = this.getCircuitBreaker(request.serviceId, service.circuitBreaker);

    try {
      instance.connectionCount++;
      
      const response = await circuitBreaker.execute(async () => {
        return this.executeRequest(instance, request, service);
      });

      const duration = Date.now() - startTime;
      this.recordMetrics({
        requestId: request.id,
        serviceId: request.serviceId,
        instanceId: instance.id,
        method: request.method,
        path: request.path,
        statusCode: response.status,
        duration,
        timestamp: new Date()
      });

      this.emit('requestCompleted', { request, response, instance });
      return response;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetrics({
        requestId: request.id,
        serviceId: request.serviceId,
        instanceId: instance.id,
        method: request.method,
        path: request.path,
        statusCode: 500,
        duration,
        timestamp: new Date(),
        error: (error as Error).message
      });

      this.emit('requestFailed', { request, error, instance });
      throw error;
    } finally {
      instance.connectionCount--;
    }
  }

  private async executeRequest(
    instance: ServiceInstance,
    request: ServiceRequest,
    service: ServiceDefinition
  ): Promise<ServiceResponse> {
    const url = `${service.protocol}://${instance.host}:${instance.port}${request.path}`;
    
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': request.id,
        ...request.headers
      }
    };

    if (request.body) {
      fetchOptions.body = JSON.stringify(request.body);
    }

    const timeout = request.timeout || 30000;
    
    const response = await fetch(url, {
      ...fetchOptions
    });

    let body;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      requestId: request.id,
      status: response.status,
      headers,
      body,
      duration: 0, // Will be set by caller
      fromInstance: instance.id
    };
  }

  private getCircuitBreaker(serviceId: string, config?: CircuitBreakerConfig): CircuitBreaker {
    if (!this.circuitBreakers.has(serviceId)) {
      const defaultConfig: CircuitBreakerConfig = {
        failureThreshold: 5,
        recoveryTimeout: 60000,
        monitoringPeriod: 10000
      };
      
      this.circuitBreakers.set(
        serviceId,
        new CircuitBreaker(config || defaultConfig, serviceId)
      );
    }
    
    return this.circuitBreakers.get(serviceId)!;
  }

  private recordMetrics(metrics: ServiceMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 10000 metrics
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }
  }

  getMetrics(serviceId?: string, limit?: number): ServiceMetrics[] {
    let filtered = this.metrics;
    
    if (serviceId) {
      filtered = filtered.filter(m => m.serviceId === serviceId);
    }
    
    if (limit) {
      filtered = filtered.slice(-limit);
    }
    
    return filtered;
  }

  getServiceHealth(serviceId: string): {
    circuitBreakerState: string;
    failureCount: number;
    averageResponseTime: number;
    errorRate: number;
  } {
    const circuitBreaker = this.circuitBreakers.get(serviceId);
    const serviceMetrics = this.getMetrics(serviceId, 1000);
    
    const averageResponseTime = serviceMetrics.length > 0 ?
      serviceMetrics.reduce((sum, m) => sum + m.duration, 0) / serviceMetrics.length : 0;
    
    const errorCount = serviceMetrics.filter(m => m.statusCode >= 400).length;
    const errorRate = serviceMetrics.length > 0 ? errorCount / serviceMetrics.length : 0;

    return {
      circuitBreakerState: circuitBreaker?.getState() || 'CLOSED',
      failureCount: circuitBreaker?.getFailureCount() || 0,
      averageResponseTime,
      errorRate
    };
  }
}

// API Gateway
export class APIGateway extends EventEmitter {
  constructor(
    private serviceMesh: ServiceMeshClient,
    private registry: ServiceRegistry
  ) {
    super();
  }

  async routeRequest(
    method: string,
    path: string,
    serviceId: string,
    body?: any,
    headers?: Record<string, string>,
    timeout?: number
  ): Promise<ServiceResponse> {
    const request: ServiceRequest = {
      id: uuidv4(),
      serviceId,
      method,
      path,
      headers,
      body,
      timeout
    };

    this.emit('requestRouted', { request });

    try {
      const response = await this.serviceMesh.request(request);
      this.emit('routeCompleted', { request, response });
      return response;
    } catch (error) {
      this.emit('routeFailed', { request, error });
      throw error;
    }
  }

  // Service discovery helper
  discoverServices(tag?: string): ServiceDefinition[] {
    const services = this.registry.getAllServices();
    
    if (tag) {
      return services.filter(service => 
        service.tags && service.tags.includes(tag)
      );
    }
    
    return services;
  }

  // Get service health status
  getSystemHealth(): Record<string, any> {
    const services = this.registry.getAllServices();
    const health: Record<string, any> = {};

    for (const service of services) {
      const instances = this.registry.getHealthyInstances(service.id);
      const serviceHealth = this.serviceMesh.getServiceHealth(service.id);
      
      health[service.id] = {
        name: service.name,
        version: service.version,
        healthyInstances: instances.length,
        totalInstances: this.registry.getInstances(service.id).length,
        ...serviceHealth
      };
    }

    return health;
  }
}
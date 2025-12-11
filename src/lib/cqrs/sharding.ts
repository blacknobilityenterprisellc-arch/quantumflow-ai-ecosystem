/**
 * Database Sharding Strategy Implementation
 * Enterprise Architecture 2.0 - Quantum Enhanced
 * Horizontal scaling with intelligent data distribution
 */

import { EventEmitter } from 'events';

export interface ShardConfig {
  id: string;
  host: string;
  port: number;
  database: string;
  weight?: number;
  maxConnections?: number;
  isPrimary?: boolean;
  region?: string;
}

export interface ShardingStrategy {
  name: string;
  getShardKey(data: any): string;
  getShardId(shardKey: string): string;
  redistribute?(data: any): Promise<string>;
}

export interface ShardConnection {
  shardId: string;
  connection: any; // Database connection
  isActive: boolean;
  lastUsed: Date;
  queryCount: number;
  errorCount: number;
}

export interface QueryPlan {
  shards: string[];
  strategy: 'single' | 'parallel' | 'broadcast';
  aggregationRequired: boolean;
  estimatedCost: number;
}

export interface ShardingMetrics {
  totalQueries: number;
  totalShards: number;
  activeConnections: number;
  averageResponseTime: number;
  shardUtilization: Record<string, number>;
  errorRate: number;
}

// Hash-based Sharding Strategy
export class HashShardingStrategy implements ShardingStrategy {
  name = 'hash';

  constructor(
    private shardCount: number,
    private hashFunction?: (data: any) => string
  ) {}

  getShardKey(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    if (this.hashFunction) {
      return this.hashFunction(data);
    }
    return JSON.stringify(data);
  }

  getShardId(shardKey: string): string {
    let hash = 0;
    for (let i = 0; i < shardKey.length; i++) {
      const char = shardKey.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `shard-${Math.abs(hash) % this.shardCount}`;
  }
}

// Range-based Sharding Strategy
export class RangeShardingStrategy implements ShardingStrategy {
  name = 'range';

  constructor(
    private ranges: Array<{ min: any; max: any; shardId: string }>,
    private keyExtractor: (data: any) => any
  ) {}

  getShardKey(data: any): string {
    return this.keyExtractor(data).toString();
  }

  getShardId(shardKey: string): string {
    const value = parseFloat(shardKey);
    
    for (const range of this.ranges) {
      if (value >= range.min && value < range.max) {
        return range.shardId;
      }
    }
    
    throw new Error(`No shard found for key: ${shardKey}`);
  }
}

// Directory-based Sharding Strategy
export class DirectoryShardingStrategy implements ShardingStrategy {
  name = 'directory';
  private directory: Map<string, string> = new Map();

  constructor(private directoryService?: { getShardId(key: string): Promise<string> }) {}

  getShardKey(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    if (data.id) {
      return data.id.toString();
    }
    return JSON.stringify(data);
  }

  async getShardId(shardKey: string): Promise<string> {
    // Check local directory first
    if (this.directory.has(shardKey)) {
      return this.directory.get(shardKey)!;
    }

    // Query directory service if available
    if (this.directoryService) {
      const shardId = await this.directoryService.getShardId(shardKey);
      this.directory.set(shardKey, shardId);
      return shardId;
    }

    throw new Error('No directory service available and key not found in local directory');
  }

  getShardIdSync(shardKey: string): string {
    if (this.directory.has(shardKey)) {
      return this.directory.get(shardKey)!;
    }
    throw new Error(`Key not found in directory: ${shardKey}`);
  }

  // Synchronous version for backward compatibility
  getShardId(shardKey: string): string {
    return this.getShardIdSync(shardKey);
  }

  async redistribute(data: any): Promise<string> {
    const shardKey = this.getShardKey(data);
    const newShardId = await this.getShardId(shardKey);
    return newShardId;
  }
}

// Consistent Hash-based Sharding Strategy
export class ConsistentHashShardingStrategy implements ShardingStrategy {
  name = 'consistent_hash';
  private ring: number[] = [];
  private ringMap: Map<number, string> = new Map();
  private virtualNodes: number = 150; // Number of virtual nodes per physical shard

  constructor(shards: string[]) {
    this.initializeRing(shards);
  }

  private initializeRing(shards: string[]): void {
    this.ring = [];
    this.ringMap.clear();

    for (const shard of shards) {
      for (let i = 0; i < this.virtualNodes; i++) {
        const virtualNodeKey = `${shard}:${i}`;
        const hash = this.hash(virtualNodeKey);
        this.ring.push(hash);
        this.ringMap.set(hash, shard);
      }
    }

    this.ring.sort((a, b) => a - b);
  }

  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  getShardKey(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    if (data.id) {
      return data.id.toString();
    }
    return JSON.stringify(data);
  }

  getShardId(shardKey: string): string {
    if (this.ring.length === 0) {
      throw new Error('No shards available');
    }

    const hash = this.hash(shardKey);
    
    // Find the first node on the ring that is >= hash
    for (const ringHash of this.ring) {
      if (ringHash >= hash) {
        return this.ringMap.get(ringHash)!;
      }
    }
    
    // Wrap around to the first node
    return this.ringMap.get(this.ring[0])!;
  }

  addShard(shardId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const virtualNodeKey = `${shardId}:${i}`;
      const hash = this.hash(virtualNodeKey);
      this.ring.push(hash);
      this.ringMap.set(hash, shardId);
    }
    this.ring.sort((a, b) => a - b);
  }

  removeShard(shardId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const virtualNodeKey = `${shardId}:${i}`;
      const hash = this.hash(virtualNodeKey);
      const index = this.ring.indexOf(hash);
      if (index !== -1) {
        this.ring.splice(index, 1);
        this.ringMap.delete(hash);
      }
    }
  }
}

// Shard Manager
export class ShardManager extends EventEmitter {
  private connections: Map<string, ShardConnection> = new Map();
  private strategies: Map<string, ShardingStrategy> = new Map();
  private defaultStrategy: string = 'hash';
  private metrics: ShardingMetrics;

  constructor(
    private shardConfigs: ShardConfig[],
    private connectionFactory: (config: ShardConfig) => Promise<any>
  ) {
    super();
    this.metrics = {
      totalQueries: 0,
      totalShards: shardConfigs.length,
      activeConnections: 0,
      averageResponseTime: 0,
      shardUtilization: {},
      errorRate: 0
    };

    this.initializeStrategies();
    this.initializeConnections();
  }

  private initializeStrategies(): void {
    // Initialize default strategies
    this.strategies.set('hash', new HashShardingStrategy(this.shardConfigs.length));
    this.strategies.set('consistent_hash', new ConsistentHashShardingStrategy(
      this.shardConfigs.map(config => config.id)
    ));
  }

  private async initializeConnections(): Promise<void> {
    for (const config of this.shardConfigs) {
      try {
        const connection = await this.connectionFactory(config);
        this.connections.set(config.id, {
          shardId: config.id,
          connection,
          isActive: true,
          lastUsed: new Date(),
          queryCount: 0,
          errorCount: 0
        });
        this.metrics.activeConnections++;
        this.metrics.shardUtilization[config.id] = 0;
      } catch (error) {
        this.emit('connectionError', { shardId: config.id, error });
      }
    }
  }

  // Register custom sharding strategy
  registerStrategy(name: string, strategy: ShardingStrategy): void {
    this.strategies.set(name, strategy);
  }

  // Set default strategy
  setDefaultStrategy(strategyName: string): void {
    if (!this.strategies.has(strategyName)) {
      throw new Error(`Strategy not found: ${strategyName}`);
    }
    this.defaultStrategy = strategyName;
  }

  // Get shard for data
  getShardForData(data: any, strategyName?: string): string {
    const strategy = this.strategies.get(strategyName || this.defaultStrategy);
    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyName || this.defaultStrategy}`);
    }

    const shardKey = strategy.getShardKey(data);
    return strategy.getShardId(shardKey);
  }

  // Get connection for shard
  getConnection(shardId: string): any {
    const shardConnection = this.connections.get(shardId);
    if (!shardConnection) {
      throw new Error(`Shard not found: ${shardId}`);
    }

    if (!shardConnection.isActive) {
      throw new Error(`Shard is not active: ${shardId}`);
    }

    shardConnection.lastUsed = new Date();
    shardConnection.queryCount++;
    this.metrics.shardUtilization[shardId] = shardConnection.queryCount;

    return shardConnection.connection;
  }

  // Execute query on specific shard
  async executeOnShard<T>(
    shardId: string, 
    query: string, 
    params?: any[]
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalQueries++;

    try {
      const connection = this.getConnection(shardId);
      const result = await this.executeQuery(connection, query, params);
      
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, shardId, false);
      
      this.emit('queryExecuted', { shardId, query, responseTime, result });
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(responseTime, shardId, true);
      
      this.emit('queryError', { shardId, query, error, responseTime });
      throw error;
    }
  }

  // Execute query on all shards (broadcast)
  async executeOnAllShards<T>(
    query: string, 
    params?: any[]
  ): Promise<Map<string, T>> {
    const results = new Map<string, T>();
    const promises: Promise<void>[] = [];

    for (const shardId of this.connections.keys()) {
      const promise = this.executeOnShard<T>(shardId, query, params)
        .then(result => results.set(shardId, result))
        .catch(error => this.emit('shardQueryError', { shardId, error }));
      
      promises.push(promise);
    }

    await Promise.all(promises);
    return results;
  }

  // Execute query with automatic sharding
  async executeQuery<T>(
    query: string, 
    data?: any, 
    strategyName?: string,
    params?: any[]
  ): Promise<T | Map<string, T>> {
    if (!data) {
      // No data provided, execute on all shards
      return this.executeOnAllShards<T>(query, params) as any;
    }

    const shardId = this.getShardForData(data, strategyName);
    return this.executeOnShard<T>(shardId, query, params);
  }

  // Create query plan
  createQueryPlan(query: string, data?: any, strategyName?: string): QueryPlan {
    if (!data) {
      return {
        shards: Array.from(this.connections.keys()),
        strategy: 'broadcast',
        aggregationRequired: true,
        estimatedCost: this.connections.size * 10 // Base cost per shard
      };
    }

    const shardId = this.getShardForData(data, strategyName);
    return {
      shards: [shardId],
      strategy: 'single',
      aggregationRequired: false,
      estimatedCost: 10
    };
  }

  // Redistribute data
  async redistributeData(
    data: any[], 
    fromStrategy: string, 
    toStrategy: string
  ): Promise<void> {
    const fromStrat = this.strategies.get(fromStrategy);
    const toStrat = this.strategies.get(toStrategy);
    
    if (!fromStrat || !toStrat) {
      throw new Error('Invalid strategy names');
    }

    for (const item of data) {
      const oldShardId = fromStrat.getShardId(fromStrat.getShardKey(item));
      const newShardId = toStrat.getShardId(toStrat.getShardKey(item));
      
      if (oldShardId !== newShardId) {
        // Move data from old shard to new shard
        await this.moveData(item, oldShardId, newShardId);
      }
    }
  }

  // Health check for all shards
  async healthCheck(): Promise<Map<string, boolean>> {
    const healthStatus = new Map<string, boolean>();
    
    for (const [shardId, connection] of this.connections) {
      try {
        // Simple health check - adjust based on your database
        await this.executeQuery(connection.connection, 'SELECT 1');
        connection.isActive = true;
        healthStatus.set(shardId, true);
      } catch (error) {
        connection.isActive = false;
        connection.errorCount++;
        healthStatus.set(shardId, false);
        this.emit('shardUnhealthy', { shardId, error });
      }
    }

    return healthStatus;
  }

  // Get metrics
  getMetrics(): ShardingMetrics {
    return { ...this.metrics };
  }

  // Add new shard
  async addShard(config: ShardConfig): Promise<void> {
    try {
      const connection = await this.connectionFactory(config);
      this.connections.set(config.id, {
        shardId: config.id,
        connection,
        isActive: true,
        lastUsed: new Date(),
        queryCount: 0,
        errorCount: 0
      });

      this.shardConfigs.push(config);
      this.metrics.totalShards++;
      this.metrics.activeConnections++;
      this.metrics.shardUtilization[config.id] = 0;

      // Update strategies that need to know about new shards
      const consistentHashStrategy = this.strategies.get('consistent_hash') as ConsistentHashShardingStrategy;
      if (consistentHashStrategy) {
        consistentHashStrategy.addShard(config.id);
      }

      this.emit('shardAdded', { shardId: config.id });
    } catch (error) {
      this.emit('shardAddError', { shardId: config.id, error });
      throw error;
    }
  }

  // Remove shard
  async removeShard(shardId: string): Promise<void> {
    const connection = this.connections.get(shardId);
    if (!connection) {
      throw new Error(`Shard not found: ${shardId}`);
    }

    // Close connection
    try {
      await connection.connection.close();
    } catch (error) {
      // Ignore connection close errors
    }

    this.connections.delete(shardId);
    this.metrics.totalShards--;
    this.metrics.activeConnections--;
    delete this.metrics.shardUtilization[shardId];

    // Update strategies
    const consistentHashStrategy = this.strategies.get('consistent_hash') as ConsistentHashShardingStrategy;
    if (consistentHashStrategy) {
      consistentHashStrategy.removeShard(shardId);
    }

    this.emit('shardRemoved', { shardId });
  }

  // Private helper methods
  private async executeQuery(connection: any, query: string, params?: any[]): Promise<any> {
    // This would be implemented based on your database driver
    // For example, for PostgreSQL:
    // return await connection.query(query, params);
    throw new Error('Database-specific query execution not implemented');
  }

  private updateMetrics(responseTime: number, shardId: string, isError: boolean): void {
    // Update average response time
    const totalQueries = this.metrics.totalQueries;
    const currentAvg = this.metrics.averageResponseTime;
    this.metrics.averageResponseTime = (currentAvg * (totalQueries - 1) + responseTime) / totalQueries;

    // Update error count
    if (isError) {
      const connection = this.connections.get(shardId);
      if (connection) {
        connection.errorCount++;
      }
    }
  }

  private async moveData(data: any, fromShardId: string, toShardId: string): Promise<void> {
    // Implement data movement logic
    // This would involve:
    // 1. Reading data from source shard
    // 2. Writing data to target shard
    // 3. Deleting data from source shard
    // 4. Handling any conflicts or errors
    this.emit('dataMoved', { data, fromShardId, toShardId });
  }
}

// Sharding Utilities
export class ShardingUtils {
  static createHashShardingStrategy(shardCount: number): HashShardingStrategy {
    return new HashShardingStrategy(shardCount);
  }

  static createRangeShardingStrategy(
    ranges: Array<{ min: any; max: any; shardId: string }>,
    keyExtractor: (data: any) => any
  ): RangeShardingStrategy {
    return new RangeShardingStrategy(ranges, keyExtractor);
  }

  static createDirectoryShardingStrategy(
    directoryService?: { getShardId(key: string): Promise<string> }
  ): DirectoryShardingStrategy {
    return new DirectoryShardingStrategy(directoryService);
  }

  static createConsistentHashShardingStrategy(shards: string[]): ConsistentHashShardingStrategy {
    return new ConsistentHashShardingStrategy(shards);
  }
}
// src/lib/metrics.ts
import client from 'prom-client';

// Enable collection of default metrics
client.collectDefaultMetrics({ timeout: 10000 });

// ==== HTTP METRICS ====
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['service', 'handler', 'method', 'statusCode', 'env']
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['service', 'handler', 'method', 'statusCode', 'env'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

// ==== QUANTUM METRICS ====
export const quantumCoherenceLevel = new client.Gauge({
  name: 'quantum_coherence_level',
  help: 'Current quantum coherence level (0.0-1.0)',
  labelNames: ['service', 'algorithm', 'env']
});

export const quantumAlgorithmPerformance = new client.Histogram({
  name: 'quantum_algorithm_performance_seconds',
  help: 'Quantum algorithm execution time in seconds',
  labelNames: ['service', 'algorithm', 'success', 'env'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 5]
});

export const quantumOptimizationCycles = new client.Counter({
  name: 'quantum_optimization_cycles_total',
  help: 'Total quantum optimization cycles completed',
  labelNames: ['service', 'algorithm', 'success', 'env']
});

// ==== SYSTEM HEALTH METRICS ====
export const systemHealthScore = new client.Gauge({
  name: 'system_health_score',
  help: 'Overall system health score (0-100)',
  labelNames: ['service', 'component', 'env']
});

export const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['service', 'type', 'env']
});

export const errorRate = new client.Gauge({
  name: 'error_rate',
  help: 'Current error rate (0-1)',
  labelNames: ['service', 'component', 'env']
});

// ==== BUSINESS METRICS ====
export const userSessionsActive = new client.Gauge({
  name: 'user_sessions_active',
  help: 'Number of active user sessions',
  labelNames: ['service', 'env']
});

export const transactionsProcessed = new client.Counter({
  name: 'transactions_processed_total',
  help: 'Total number of transactions processed',
  labelNames: ['service', 'type', 'status', 'env']
});

export const revenueGenerated = new client.Counter({
  name: 'revenue_generated_total',
  help: 'Total revenue generated in USD',
  labelNames: ['service', 'source', 'env']
});

// ==== INFRASTRUCTURE METRICS ====
export const cpuUtilization = new client.Gauge({
  name: 'cpu_utilization_percent',
  help: 'CPU utilization percentage',
  labelNames: ['service', 'core', 'env']
});

export const memoryUsage = new client.Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['service', 'type', 'env']
});

export const diskUsage = new client.Gauge({
  name: 'disk_usage_bytes',
  help: 'Disk usage in bytes',
  labelNames: ['service', 'mount', 'env']
});

// ==== DATABASE METRICS ====
export const databaseConnections = new client.Gauge({
  name: 'database_connections',
  help: 'Number of database connections',
  labelNames: ['service', 'database', 'state', 'env']
});

export const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['service', 'database', 'operation', 'env'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1]
});

// ==== CACHE METRICS ====
export const cacheHitRate = new client.Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate (0-1)',
  labelNames: ['service', 'cache', 'env']
});

export const cacheOperations = new client.Counter({
  name: 'cache_operations_total',
  help: 'Total cache operations',
  labelNames: ['service', 'cache', 'operation', 'env']
});

// ==== SECURITY METRICS ====
export const securityEvents = new client.Counter({
  name: 'security_events_total',
  help: 'Total security events',
  labelNames: ['service', 'event_type', 'severity', 'env']
});

export const authenticationAttempts = new client.Counter({
  name: 'authentication_attempts_total',
  help: 'Total authentication attempts',
  labelNames: ['service', 'method', 'result', 'env']
});

// ==== PERFORMANCE MONITORING HELPERS ====

// Helper function to start timing HTTP requests
export const startHttpRequestTimer = (service: string, handler: string, method: string) => {
  return httpRequestDuration.startTimer({ service, handler, method });
};

// Helper function to record HTTP request completion
export const recordHttpRequest = (
  service: string,
  handler: string,
  method: string,
  statusCode: number | string,
  env: string = process.env.NODE_ENV || 'development'
) => {
  const statusCodeStr = String(statusCode);
  httpRequestsTotal.inc({ service, handler, method, statusCode: statusCodeStr, env }, 1);
};

// Helper function to time quantum algorithms
export const startQuantumAlgorithmTimer = (service: string, algorithm: string) => {
  return quantumAlgorithmPerformance.startTimer({ service, algorithm, success: 'false', env: process.env.NODE_ENV || 'development' });
};

// Helper function to record quantum algorithm completion
export const recordQuantumAlgorithm = (
  service: string,
  algorithm: string,
  success: boolean,
  env: string = process.env.NODE_ENV || 'development'
) => {
  quantumOptimizationCycles.inc({ service, algorithm, success: success.toString(), env }, 1);
};

// Helper function to update system health
export const updateSystemHealth = (
  service: string,
  component: string,
  score: number,
  env: string = process.env.NODE_ENV || 'development'
) => {
  systemHealthScore.set({ service, component, env }, Math.max(0, Math.min(100, score)));
};

// Helper function to update quantum coherence
export const updateQuantumCoherence = (
  service: string,
  algorithm: string,
  coherence: number,
  env: string = process.env.NODE_ENV || 'development'
) => {
  quantumCoherenceLevel.set({ service, algorithm, env }, Math.max(0, Math.min(1, coherence)));
};

// Export the registry for use in /metrics endpoint
export const registry = client.register;

// Export metrics collection for easy bulk operations
export const allMetrics = {
  http: {
    requestsTotal: httpRequestsTotal,
    requestDuration: httpRequestDuration
  },
  quantum: {
    coherenceLevel: quantumCoherenceLevel,
    algorithmPerformance: quantumAlgorithmPerformance,
    optimizationCycles: quantumOptimizationCycles
  },
  system: {
    healthScore: systemHealthScore,
    activeConnections,
    errorRate
  },
  business: {
    userSessionsActive,
    transactionsProcessed,
    revenueGenerated
  },
  infrastructure: {
    cpuUtilization,
    memoryUsage,
    diskUsage
  },
  database: {
    connections: databaseConnections,
    queryDuration: databaseQueryDuration
  },
  cache: {
    hitRate: cacheHitRate,
    operations: cacheOperations
  },
  security: {
    events: securityEvents,
    authenticationAttempts
  }
};

// Helper to reset all metrics (useful for testing)
export const resetAllMetrics = () => {
  registry.clear();
  client.collectDefaultMetrics({ timeout: 10000 });
};

// Health check function for metrics system
export const getMetricsHealth = () => {
  return {
    status: 'healthy',
    metricsCount: registry.getMetricsAsJSON().length,
    timestamp: new Date().toISOString()
  };
};
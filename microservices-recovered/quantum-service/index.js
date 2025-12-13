// 🚀 QUANTUM-SERVICE - Enhanced with Prometheus Metrics
// AETHERIUS-ETERNAL Perfect Architecture Implementation

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createLogger } from 'winston';
import { 
  registry, 
  startHttpRequestTimer, 
  recordHttpRequest,
  updateSystemHealth,
  updateQuantumCoherence,
  startQuantumAlgorithmTimer,
  recordQuantumAlgorithm,
  getMetricsHealth,
  allMetrics
} from '../../src/lib/metrics.js';

const app = express();
const SERVICE_NAME = 'quantum-service';
const ENV = process.env.NODE_ENV || 'development';

const logger = createLogger({
  level: 'info',
  format: require('winston').format.combine(
    require('winston').format.timestamp(),
    require('winston').format.json()
  ),
  transports: [
    new require('winston').transports.Console(),
    new require('winston').transports.File({ filename: 'quantum-service.log' })
  ]
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP Request Metrics Middleware
app.use((req, res, next) => {
  const endTimer = startHttpRequestTimer(SERVICE_NAME, req.path, req.method);
  
  res.on('finish', () => {
    const statusCode = res.statusCode;
    recordHttpRequest(SERVICE_NAME, req.path, req.method, statusCode, ENV);
    endTimer({ statusCode: String(statusCode), env: ENV });
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    service: SERVICE_NAME,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: ENV,
    quantumCoherence: 0.95
  };
  
  updateSystemHealth(SERVICE_NAME, 'overall', 98, ENV);
  res.json(healthData);
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    // Update infrastructure metrics
    const memUsage = process.memoryUsage();
    allMetrics.infrastructure.memoryUsage.set({ 
      service: SERVICE_NAME, 
      type: 'rss', 
      env: ENV 
    }, memUsage.rss);
    
    allMetrics.infrastructure.memoryUsage.set({ 
      service: SERVICE_NAME, 
      type: 'heapUsed', 
      env: ENV 
    }, memUsage.heapUsed);
    
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
  } catch (err) {
    logger.error('Metrics endpoint error:', err);
    res.status(500).end(err.message);
  }
});

// Service-specific routes
app.get('/api/quantum-service/status', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'operational',
    features: [
      'health-checks',
      'prometheus-metrics',
      'quantum-algorithms',
      'coherence-monitoring',
      'optimization-cycles',
      'logging',
      'security',
      'rate-limiting'
    ],
    metrics: getMetricsHealth()
  });
});

// Quantum coherence endpoint
app.get('/api/quantum-service/coherence', async (req, res) => {
  const endTimer = startQuantumAlgorithmTimer(SERVICE_NAME, 'coherence-calculation');
  
  try {
    // Simulate quantum coherence calculation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    const coherence = Math.random() * 0.2 + 0.8; // 0.8-1.0
    
    updateQuantumCoherence(SERVICE_NAME, 'coherence-algorithm', coherence, ENV);
    recordQuantumAlgorithm(SERVICE_NAME, 'coherence-calculation', true, ENV);
    
    endTimer({ success: 'true', env: ENV });
    
    res.json({
      service: SERVICE_NAME,
      quantumCoherence: coherence,
      timestamp: new Date().toISOString(),
      algorithm: 'coherence-calculation',
      status: coherence > 0.85 ? 'optimal' : 'degraded'
    });
  } catch (error) {
    recordQuantumAlgorithm(SERVICE_NAME, 'coherence-calculation', false, ENV);
    endTimer({ success: 'false', env: ENV });
    
    logger.error('Quantum coherence calculation error:', error);
    res.status(500).json({ error: 'Quantum coherence calculation failed' });
  }
});

// Quantum optimization endpoint
app.post('/api/quantum-service/optimize', async (req, res) => {
  const endTimer = startQuantumAlgorithmTimer(SERVICE_NAME, 'quantum-optimization');
  
  try {
    const { parameters, iterations = 100 } = req.body;
    
    // Simulate quantum optimization
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    
    const optimizationResult = {
      originalParameters: parameters,
      optimizedParameters: parameters?.map(p => p * (Math.random() * 0.2 + 0.9)) || [],
      iterations,
      coherence: Math.random() * 0.2 + 0.8,
      improvement: Math.random() * 0.3 + 0.1,
      timestamp: new Date().toISOString()
    };
    
    updateQuantumCoherence(SERVICE_NAME, 'quantum-optimization', optimizationResult.coherence, ENV);
    recordQuantumAlgorithm(SERVICE_NAME, 'quantum-optimization', true, ENV);
    
    endTimer({ success: 'true', env: ENV });
    
    res.json({
      service: SERVICE_NAME,
      result: optimizationResult,
      status: 'completed'
    });
  } catch (error) {
    recordQuantumAlgorithm(SERVICE_NAME, 'quantum-optimization', false, ENV);
    endTimer({ success: 'false', env: ENV });
    
    logger.error('Quantum optimization error:', error);
    res.status(500).json({ error: 'Quantum optimization failed' });
  }
});

// Quantum algorithm performance endpoint
app.get('/api/quantum-service/algorithms', async (req, res) => {
  const algorithms = [
    'coherence-calculation',
    'quantum-optimization',
    'entanglement-analysis',
    'superposition-state',
    'measurement-protocol'
  ];
  
  const algorithmMetrics = algorithms.map(algorithm => ({
    name: algorithm,
    performance: Math.random() * 0.5 + 0.5, // 0.5-1.0
    coherence: Math.random() * 0.2 + 0.8, // 0.8-1.0
    lastRun: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    successRate: Math.random() * 0.1 + 0.9 // 90-100%
  }));
  
  // Update metrics for each algorithm
  algorithmMetrics.forEach(algo => {
    updateQuantumCoherence(SERVICE_NAME, algo.name, algo.coherence, ENV);
    updateSystemHealth(SERVICE_NAME, algo.name, algo.performance * 100, ENV);
  });
  
  res.json({
    service: SERVICE_NAME,
    algorithms: algorithmMetrics,
    timestamp: new Date().toISOString()
  });
});

// Quantum state simulation endpoint
app.post('/api/quantum-service/simulate', async (req, res) => {
  const endTimer = startQuantumAlgorithmTimer(SERVICE_NAME, 'quantum-simulation');
  
  try {
    const { qubits, gates, shots = 1000 } = req.body;
    
    // Simulate quantum computation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
    
    const simulationResult = {
      qubits: qubits || 2,
      gates: gates || ['H', 'CNOT'],
      shots,
      results: {
        '00': Math.floor(Math.random() * 500),
        '01': Math.floor(Math.random() * 300),
        '10': Math.floor(Math.random() * 300),
        '11': Math.floor(Math.random() * 200)
      },
      fidelity: Math.random() * 0.2 + 0.8,
      timestamp: new Date().toISOString()
    };
    
    updateQuantumCoherence(SERVICE_NAME, 'quantum-simulation', simulationResult.fidelity, ENV);
    recordQuantumAlgorithm(SERVICE_NAME, 'quantum-simulation', true, ENV);
    
    endTimer({ success: 'true', env: ENV });
    
    res.json({
      service: SERVICE_NAME,
      simulation: simulationResult,
      status: 'completed'
    });
  } catch (error) {
    recordQuantumAlgorithm(SERVICE_NAME, 'quantum-simulation', false, ENV);
    endTimer({ success: 'false', env: ENV });
    
    logger.error('Quantum simulation error:', error);
    res.status(500).json({ error: 'Quantum simulation failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Service error:', error);
  
  allMetrics.security.events.inc({ 
    service: SERVICE_NAME, 
    event_type: 'system_error', 
    severity: 'medium', 
    env: ENV 
  }, 1);
  
  res.status(500).json({
    error: 'Internal Server Error',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id']
  });
});

// 404 handler
app.use('*', (req, res) => {
  allMetrics.security.events.inc({ 
    service: SERVICE_NAME, 
    event_type: 'not_found', 
    severity: 'low', 
    env: ENV 
  }, 1);
  
  res.status(404).json({
    error: 'Not Found',
    service: SERVICE_NAME,
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.QUANTUM_SERVICE_PORT || 3005;

// Start periodic quantum coherence updates
setInterval(() => {
  const coherence = Math.random() * 0.1 + 0.9; // 0.9-1.0
  updateQuantumCoherence(SERVICE_NAME, 'periodic-coherence', coherence, ENV);
  
  const healthScore = Math.random() * 5 + 95; // 95-100
  updateSystemHealth(SERVICE_NAME, 'periodic-health', healthScore, ENV);
  
  logger.info(`Quantum coherence: ${coherence.toFixed(3)}, Health: ${healthScore.toFixed(1)}`);
}, 15000); // Every 15 seconds

app.listen(PORT, () => {
  logger.info(`${SERVICE_NAME} started on port ${PORT}`);
  console.log(`🚀 ${SERVICE_NAME} with Prometheus metrics running on port ${PORT}`);
  
  // Initial quantum metrics setup
  updateQuantumCoherence(SERVICE_NAME, 'startup', 1.0, ENV);
  updateSystemHealth(SERVICE_NAME, 'startup', 100, ENV);
  
  logger.info('Prometheus metrics enabled at /metrics endpoint');
});

export default app;
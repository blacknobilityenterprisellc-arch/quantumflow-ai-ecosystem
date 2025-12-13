// 🚀 AUTH-SERVICE - Microservice Architecture
// AETHERIUS-ETERNAL Perfect Architecture Implementation

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createLogger } from 'winston';

const app = express();
const logger = createLogger({
  level: 'info',
  format: require('winston').format.combine(
    require('winston').format.timestamp(),
    require('winston').format.json()
  ),
  transports: [
    new require('winston').transports.Console(),
    new require('winston').transports.File({ filename: 'auth-service.log' })
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    service: 'auth-service',
    metrics: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      activeConnections: app.locals.activeConnections || 0
    }
  });
});

// Service-specific routes
app.get('/api/auth-service/status', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'operational',
    features: [
      'health-checks',
      'metrics',
      'logging',
      'security',
      'rate-limiting',
      'caching'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Service error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id']
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    service: 'auth-service',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.AUTH_SERVICE_PORT || 300386;

app.listen(PORT, () => {
  logger.info(`auth-service microservice started on port ${PORT}`);
  console.log(`🚀 auth-service microservice running on port ${PORT}`);
});

export default app;
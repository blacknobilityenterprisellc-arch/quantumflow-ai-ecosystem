// 🚀 PAYMENT-SERVICE - Microservice Architecture
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
    new require('winston').transports.File({ filename: 'payment-service.log' })
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
    service: 'payment-service',
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
    service: 'payment-service',
    metrics: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      activeConnections: app.locals.activeConnections || 0
    }
  });
});

// Service-specific routes
app.get('/api/payment-service/status', (req, res) => {
  res.json({
    service: 'payment-service',
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
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id']
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    service: 'payment-service',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PAYMENT_SERVICE_PORT || 300380;

app.listen(PORT, () => {
  logger.info(`payment-service microservice started on port ${PORT}`);
  console.log(`🚀 payment-service microservice running on port ${PORT}`);
});

export default app;
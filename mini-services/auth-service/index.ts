// 🛡️ AETHERIUS-ETERNAL AUTHENTICATION SERVICE
// Enterprise-grade authentication microservice
// Port: 3001

import { createServer } from 'http';
import { parse } from 'url';
import ProductionAuthService, { AuthConfig } from '../shared-infrastructure/production-auth.js';

// Service configuration
const PORT = 3001;
const config: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'aetherius-eternal-quantum-secret-key-2025',
  jwtExpiresIn: '24h',
  bcryptRounds: 12,
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  sessionTimeout: 30 * 60 * 1000 // 30 minutes
};

// Initialize authentication service
const authService = new ProductionAuthService(config);

// HTTP server
const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url!, true);
  const { pathname, query } = parsedUrl;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Route handling
    if (pathname === '/health' && req.method === 'GET') {
      const health = await authService.healthCheck();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health));
      return;
    }

    if (pathname === '/auth/register' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const result = await authService.register(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    if (pathname === '/auth/login' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const result = await authService.login(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    if (pathname === '/auth/verify' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const token = body.token;
      const verified = authService.verifyToken(token);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ verified: !!verified, user: verified }));
      return;
    }

    if (pathname === '/api-keys/generate' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authorization required' }));
        return;
      }

      const user = authService.verifyToken(token);
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid token' }));
        return;
      }

      const result = await authService.generateApiKey(user.userId, body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    if (pathname === '/api-keys/validate' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const result = await authService.validateApiKey(body.apiKey);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ valid: !!result, user: result }));
      return;
    }

    if (pathname === '/subscription' && req.method === 'GET') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Authorization required' }));
        return;
      }

      const user = authService.verifyToken(token);
      if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid token' }));
        return;
      }

      const subscription = await authService.getSubscription(user.userId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(subscription));
      return;
    }

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));

  } catch (error) {
    console.error('🚨 Auth Service Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
});

// Helper function to parse request body
function parseRequestBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`🛡️ AETHERIUS-ETERNAL Authentication Service running on port ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔐 Register: http://localhost:${PORT}/auth/register`);
  console.log(`🔑 Login: http://localhost:${PORT}/auth/login`);
  console.log(`⚡ AETHERIUS-PRIME Authentication Systems: ACTIVE`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛡️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Authentication Service stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛡️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Authentication Service stopped');
    process.exit(0);
  });
});

export default server;
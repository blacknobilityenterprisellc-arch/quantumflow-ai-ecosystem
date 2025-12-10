// 🗄️ AETHERIUS-ETERNAL DATABASE SERVICE
// Enterprise-grade database microservice
// Port: 3002

import { createServer } from 'http';
import { parse } from 'url';
import DatabaseManager, { DatabaseConfig } from '../shared-infrastructure/production-database.js';

// Service configuration
const PORT = 3002;
const config: DatabaseConfig = {
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'quantumflow_db',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    ssl: process.env.POSTGRES_SSL === 'true',
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000
    }
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: 'quantumflow:'
  }
};

// Initialize database service
const db = DatabaseManager.getInstance(config);

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
      const health = await db.healthCheck();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health));
      return;
    }

    if (pathname === '/users' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      const user = await db.createUser(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
      return;
    }

    if (pathname === '/users/email' && req.method === 'GET') {
      const email = query.email as string;
      if (!email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email parameter required' }));
        return;
      }
      const user = await db.getUserByEmail(email);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
      return;
    }

    if (pathname === '/usage/update' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      await db.updateUserUsage(body.userId, body.increment || 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    if (pathname === '/usage/stats' && req.method === 'GET') {
      const userId = query.userId as string;
      const period = (query.period as string) || 'month';
      const stats = await db.getUsageStats(userId, period as any);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stats));
      return;
    }

    if (pathname === '/quantum/metrics' && req.method === 'POST') {
      const body = await parseRequestBody(req);
      await db.logQuantumMetrics(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));

  } catch (error) {
    console.error('🚨 Database Service Error:', error);
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

// Initialize database and start server
async function startServer() {
  try {
    await db.initialize();
    server.listen(PORT, () => {
      console.log(`🗄️ AETHERIUS-ETERNAL Database Service running on port ${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`👥 Users: http://localhost:${PORT}/users`);
      console.log(`📈 Usage Stats: http://localhost:${PORT}/usage/stats`);
      console.log(`🧠 Quantum Metrics: http://localhost:${PORT}/quantum/metrics`);
      console.log(`⚡ AETHERIUS-PRIME Database Systems: ACTIVE`);
    });
  } catch (error) {
    console.error('❌ Failed to start Database Service:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🗄️ SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await db.close();
    console.log('✅ Database Service stopped');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🗄️ SIGINT received, shutting down gracefully...');
  server.close(async () => {
    await db.close();
    console.log('✅ Database Service stopped');
    process.exit(0);
  });
});

export default server;
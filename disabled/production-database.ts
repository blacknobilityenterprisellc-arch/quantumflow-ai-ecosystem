// 🛡️ AETHERIUS-ETERNAL PRODUCTION DATABASE SCHEMA
// Enterprise-grade data persistence with PostgreSQL + Redis

export interface DatabaseConfig {
  postgres: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
      idleTimeoutMillis: number;
    };
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
  };
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  subscriptionId?: string;
  usage: {
    requestsThisMonth: number;
    lastResetDate: Date;
    totalRequests: number;
  };
  metadata: {
    source: string;
    referrer?: string;
    userAgent?: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  userId: string;
  keyHash: string;
  name: string;
  permissions: string[];
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  usageCount: number;
}

export interface UsageLog {
  id: string;
  userId: string;
  apiKeyId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  tokensUsed?: number;
  cost?: number;
  timestamp: Date;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    service?: string;
  };
}

export interface ServiceMetrics {
  id: string;
  serviceName: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
  uptime: number;
  lastUpdated: Date;
  costPerRequest: number;
  monthlyCost: number;
}

export interface QuantumMetrics {
  id: string;
  userId?: string;
  service?: string;
  coherenceLevel: number;
  optimizationScore: number;
  systemStability: number;
  performanceIndex: number;
  errorCorrectionRate: number;
  timestamp: Date;
  algorithmUsed: string;
  improvementDelta: number;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'error';
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// Database connection singleton
class DatabaseManager {
  private static instance: DatabaseManager;
  private pgPool: any;
  private redisClient: any;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  public static getInstance(config?: DatabaseConfig): DatabaseManager {
    if (!DatabaseManager.instance) {
      if (!config) {
        throw new Error('Database config required for first initialization');
      }
      DatabaseManager.instance = new DatabaseManager(config);
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Initialize PostgreSQL connection pool
      const { Pool } = await import('pg');
      this.pgPool = new Pool({
        host: this.config.postgres.host,
        port: this.config.postgres.port,
        database: this.config.postgres.database,
        user: this.config.postgres.username,
        password: this.config.postgres.password,
        ssl: this.config.postgres.ssl,
        min: this.config.postgres.pool.min,
        max: this.config.postgres.pool.max,
        idleTimeoutMillis: this.config.postgres.pool.idleTimeoutMillis,
      });

      // Initialize Redis connection
      const { createClient } = await import('redis');
      this.redisClient = createClient({
        host: this.config.redis.host,
        port: this.config.redis.port,
        password: this.config.redis.password,
        database: this.config.redis.db,
      });

      await this.redisClient.connect();
      
      // Run database migrations
      await this.runMigrations();
      
      console.log('✅ AETHERIUS-ETERNAL Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async runMigrations(): Promise<void> {
    const migrations = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        plan VARCHAR(50) NOT NULL DEFAULT 'starter',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        subscription_id VARCHAR(255),
        usage_requests_this_month INTEGER DEFAULT 0,
        usage_last_reset_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        usage_total_requests INTEGER DEFAULT 0,
        metadata_source VARCHAR(255),
        metadata_referrer VARCHAR(255),
        metadata_user_agent TEXT
      )`,
      
      `CREATE TABLE IF NOT EXISTS subscriptions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        current_period_start TIMESTAMP NOT NULL,
        current_period_end TIMESTAMP NOT NULL,
        cancel_at_period_end BOOLEAN DEFAULT false,
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS api_keys (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        key_hash VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        permissions TEXT[],
        last_used TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        usage_count INTEGER DEFAULT 0
      )`,
      
      `CREATE TABLE IF NOT EXISTS usage_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        api_key_id VARCHAR(255) REFERENCES api_keys(id) ON DELETE SET NULL,
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER NOT NULL,
        response_time INTEGER NOT NULL,
        tokens_used INTEGER,
        cost DECIMAL(10, 4),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata_user_agent TEXT,
        metadata_ip_address VARCHAR(45),
        metadata_service VARCHAR(255)
      )`,
      
      `CREATE TABLE IF NOT EXISTS service_metrics (
        id VARCHAR(255) PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        total_requests INTEGER DEFAULT 0,
        successful_requests INTEGER DEFAULT 0,
        failed_requests INTEGER DEFAULT 0,
        average_response_time INTEGER DEFAULT 0,
        p95_response_time INTEGER DEFAULT 0,
        error_rate DECIMAL(5, 4) DEFAULT 0,
        uptime DECIMAL(5, 4) DEFAULT 1,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cost_per_request DECIMAL(10, 6) DEFAULT 0,
        monthly_cost DECIMAL(10, 2) DEFAULT 0
      )`,
      
      `CREATE TABLE IF NOT EXISTS quantum_metrics (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        service VARCHAR(255),
        coherence_level DECIMAL(5, 4) DEFAULT 0.999,
        optimization_score DECIMAL(5, 4) DEFAULT 0.999,
        system_stability DECIMAL(5, 4) DEFAULT 0.999,
        performance_index DECIMAL(5, 4) DEFAULT 0.999,
        error_correction_rate DECIMAL(5, 4) DEFAULT 0.001,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        algorithm_used VARCHAR(255),
        improvement_delta DECIMAL(5, 4) DEFAULT 0
      )`,
      
      `CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(255) NOT NULL,
        resource VARCHAR(255) NOT NULL,
        result VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      )`
    ];

    for (const migration of migrations) {
      try {
        await this.pgPool.query(migration);
        console.log('✅ Migration executed successfully');
      } catch (error) {
        console.error('❌ Migration failed:', error);
      }
    }
  }

  // User management methods
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const client = await this.pgPool.connect();
    try {
      const query = `
        INSERT INTO users (id, email, password_hash, plan, metadata_source, metadata_referrer, metadata_user_agent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [
        crypto.randomUUID(),
        userData.email,
        userData.passwordHash,
        userData.plan,
        userData.metadata.source,
        userData.metadata.referrer,
        userData.metadata.userAgent
      ];
      
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const client = await this.pgPool.connect();
    try {
      const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async updateUserUsage(userId: string, increment: number = 1): Promise<void> {
    const client = await this.pgPool.connect();
    try {
      const query = `
        UPDATE users 
        SET usage_requests_this_month = usage_requests_this_month + $1,
            usage_total_requests = usage_total_requests + $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      await client.query(query, [increment, userId]);
      
      // Cache in Redis for fast rate limiting
      await this.redisClient.setEx(
        `usage:${userId}`,
        3600, // 1 hour
        increment.toString()
      );
    } finally {
      client.release();
    }
  }

  // Quantum metrics methods
  async logQuantumMetrics(metrics: Omit<QuantumMetrics, 'id' | 'timestamp'>): Promise<void> {
    const client = await this.pgPool.connect();
    try {
      const query = `
        INSERT INTO quantum_metrics (id, user_id, service, coherence_level, optimization_score, 
        system_stability, performance_index, error_correction_rate, algorithm_used, improvement_delta)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      const values = [
        crypto.randomUUID(),
        metrics.userId,
        metrics.service,
        metrics.coherenceLevel,
        metrics.optimizationScore,
        metrics.systemStability,
        metrics.performanceIndex,
        metrics.errorCorrectionRate,
        metrics.algorithmUsed,
        metrics.improvementDelta
      ];
      
      await client.query(query, values);
      
      // Cache latest metrics in Redis
      await this.redisClient.setEx(
        `quantum:${metrics.userId || 'global'}`,
        300, // 5 minutes
        JSON.stringify(metrics)
      );
    } finally {
      client.release();
    }
  }

  // Usage analytics methods
  async getUsageStats(userId?: string, period: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    const client = await this.pgPool.connect();
    try {
      let query = `
        SELECT 
          COUNT(*) as total_requests,
          AVG(response_time) as avg_response_time,
          COUNT(CASE WHEN status_code < 400 THEN 1 END) as successful_requests,
          COUNT(CASE WHEN status_code >= 400 THEN 1 END) as failed_requests,
          SUM(tokens_used) as total_tokens,
          SUM(cost) as total_cost
        FROM usage_logs
        WHERE timestamp >= NOW() - INTERVAL '1 ${period}'
      `;
      
      const params = [];
      if (userId) {
        query += ' AND user_id = $1';
        params.push(userId);
      }
      
      const result = await client.query(query, params);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; database: string; redis: string; timestamp: string }> {
    try {
      // Check PostgreSQL
      const pgResult = await this.pgPool.query('SELECT 1 as health_check');
      const pgHealthy = pgResult.rows[0].health_check === 1;
      
      // Check Redis
      const redisResult = await this.redisClient.ping();
      const redisHealthy = redisResult === 'PONG';
      
      return {
        status: pgHealthy && redisHealthy ? 'healthy' : 'unhealthy',
        database: pgHealthy ? 'connected' : 'disconnected',
        redis: redisHealthy ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'error',
        redis: 'error',
        timestamp: new Date().toISOString()
      };
    }
  }

  async close(): Promise<void> {
    try {
      await this.pgPool.end();
      await this.redisClient.quit();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
    }
  }
}

export default DatabaseManager;
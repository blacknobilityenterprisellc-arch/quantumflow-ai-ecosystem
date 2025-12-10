// 🛡️ AETHERIUS-ETERNAL PRODUCTION AUTHENTICATION SERVICE
// Enterprise-grade authentication with database persistence

import DatabaseManager from './production-database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
  };
  sessionTimeout: number;
}

export interface AuthUser {
  id: string;
  email: string;
  plan: 'starter' | 'professional' | 'enterprise';
  usage: {
    requestsThisMonth: number;
    totalRequests: number;
    lastResetDate: Date;
  };
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: Date;
  };
}

export interface ApiKey {
  id: string;
  keyHash: string;
  name: string;
  permissions: string[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  expiresAt?: Date;
}

class ProductionAuthService {
  private db: DatabaseManager;
  private config: AuthConfig;
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: AuthConfig) {
    this.config = config;
    this.db = DatabaseManager.getInstance();
  }

  // User registration with database persistence
  async register(userData: {
    email: string;
    password: string;
    plan?: 'starter' | 'professional' | 'enterprise';
    metadata?: {
      source?: string;
      referrer?: string;
      userAgent?: string;
    };
  }): Promise<{ user: AuthUser; token: string; message: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.db.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, this.config.bcryptRounds);

      // Create user in database
      const user = await this.db.createUser({
        email: userData.email,
        passwordHash,
        plan: userData.plan || 'starter',
        isActive: true,
        usage: {
          requestsThisMonth: 0,
          totalRequests: 0,
          lastResetDate: new Date()
        },
        metadata: {
          source: userData.metadata?.source || 'direct',
          referrer: userData.metadata?.referrer,
          userAgent: userData.metadata?.userAgent
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          plan: user.plan 
        },
        this.config.jwtSecret,
        { expiresIn: this.config.jwtExpiresIn }
      );

      // Log registration
      await this.logAuditEvent('user_registered', 'auth', 'success', user.id, {
        email: userData.email,
        plan: user.plan,
        source: userData.metadata?.source
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          plan: user.plan,
          usage: user.usage
        },
        token,
        message: 'User registered successfully'
      };
    } catch (error) {
      await this.logAuditEvent('user_registration_failed', 'auth', 'error', undefined, {
        email: userData.email,
        error: error.message
      });
      throw error;
    }
  }

  // User authentication with database verification
  async login(credentials: {
    email: string;
    password: string;
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
    };
  }): Promise<{ user: AuthUser; token: string; message: string }> {
    try {
      // Get user from database
      const user = await this.db.getUserByEmail(credentials.email);
      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          plan: user.plan 
        },
        this.config.jwtSecret,
        { expiresIn: this.config.jwtExpiresIn }
      );

      // Update user usage
      await this.db.updateUserUsage(user.id, 0); // Login doesn't count towards usage

      // Log successful login
      await this.logAuditEvent('user_login', 'auth', 'success', user.id, {
        userAgent: credentials.metadata?.userAgent,
        ipAddress: credentials.metadata?.ipAddress
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          plan: user.plan,
          usage: user.usage
        },
        token,
        message: 'Login successful'
      };
    } catch (error) {
      await this.logAuditEvent('user_login_failed', 'auth', 'error', undefined, {
        email: credentials.email,
        error: error.message,
        userAgent: credentials.metadata?.userAgent,
        ipAddress: credentials.metadata?.ipAddress
      });
      throw error;
    }
  }

  // API Key generation and management
  async generateApiKey(userId: string, keyData: {
    name: string;
    permissions?: string[];
    expiresAt?: Date;
  }): Promise<{ apiKey: string; message: string }> {
    try {
      // Generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      // Store API key in database
      await this.db.createApiKey({
        userId,
        keyHash,
        name: keyData.name,
        permissions: keyData.permissions || ['read'],
        expiresAt: keyData.expiresAt,
        isActive: true,
        usageCount: 0
      });

      // Log API key creation
      await this.logAuditEvent('api_key_created', 'auth', 'success', userId, {
        keyName: keyData.name,
        permissions: keyData.permissions,
        expiresAt: keyData.expiresAt
      });

      return {
        apiKey,
        message: 'API key generated successfully'
      };
    } catch (error) {
      await this.logAuditEvent('api_key_creation_failed', 'auth', 'error', userId, {
        error: error.message,
        keyName: keyData.name
      });
      throw error;
    }
  }

  // Enhanced rate limiting with database persistence
  async checkRateLimit(identifier: string, maxRequests: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const now = Date.now();
      const windowStart = now - this.config.rateLimiting.windowMs;
      
      // Check cache first
      const cached = this.rateLimitCache.get(identifier);
      if (cached && cached.resetTime > now) {
        const allowed = cached.count < maxRequests;
        return {
          allowed,
          remaining: Math.max(0, maxRequests - cached.count),
          resetTime: cached.resetTime
        };
      }

      // Get usage from database
      const usage = await this.db.getUsageStats(identifier, 'day');
      const currentCount = usage.total_requests || 0;

      // Update cache
      this.rateLimitCache.set(identifier, {
        count: currentCount,
        resetTime: now + this.config.rateLimiting.windowMs
      });

      const allowed = currentCount < maxRequests;
      return {
        allowed,
        remaining: Math.max(0, maxRequests - currentCount),
        resetTime: now + this.config.rateLimiting.windowMs
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: maxRequests,
        resetTime: Date.now() + this.config.rateLimiting.windowMs
      };
    }
  }

  // JWT token verification
  verifyToken(token: string): { userId: string; email: string; plan: string } | null {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
        plan: decoded.plan
      };
    } catch (error) {
      return null;
    }
  }

  // API key validation
  async validateApiKey(apiKey: string): Promise<{ userId: string; permissions: string[] } | null> {
    try {
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
      const keyData = await this.db.getApiKeyByKeyHash(keyHash);
      
      if (!keyData || !keyData.isActive) {
        return null;
      }

      // Check if key has expired
      if (keyData.expiresAt && new Date() > keyData.expiresAt) {
        await this.deactivateApiKey(keyData.id);
        return null;
      }

      // Update usage
      await this.db.updateApiKeyUsage(keyData.id);

      return {
        userId: keyData.userId,
        permissions: keyData.permissions
      };
    } catch (error) {
      console.error('API key validation error:', error);
      return null;
    }
  }

  // Subscription management
  async upgradeSubscription(userId: string, newPlan: 'starter' | 'professional' | 'enterprise'): Promise<{ success: boolean; message: string }> {
    try {
      await this.db.updateUserPlan(userId, newPlan);
      
      // Log upgrade
      await this.logAuditEvent('subscription_upgraded', 'billing', 'success', userId, {
        oldPlan: 'unknown', // Would need to fetch current plan
        newPlan
      });

      return {
        success: true,
        message: `Successfully upgraded to ${newPlan} plan`
      };
    } catch (error) {
      await this.logAuditEvent('subscription_upgrade_failed', 'billing', 'error', userId, {
        newPlan,
        error: error.message
      });
      throw error;
    }
  }

  // Get user subscription info
  async getSubscription(userId: string): Promise<any> {
    try {
      const subscription = await this.db.getUserSubscription(userId);
      const user = await this.db.getUserById(userId);
      
      return {
        plan: user?.plan || 'starter',
        subscription: subscription,
        usage: user?.usage,
        limits: this.getPlanLimits(user?.plan || 'starter')
      };
    } catch (error) {
      console.error('Get subscription error:', error);
      return null;
    }
  }

  // Plan limits configuration
  private getPlanLimits(plan: string) {
    const limits = {
      starter: {
        requestsPerMonth: 1000,
        requestsPerDay: 50,
        features: ['basic_ai', 'standard_support'],
        price: 149
      },
      professional: {
        requestsPerMonth: 10000,
        requestsPerDay: 500,
        features: ['advanced_ai', 'priority_support', 'custom_models'],
        price: 399
      },
      enterprise: {
        requestsPerMonth: 100000,
        requestsPerDay: 5000,
        features: ['enterprise_ai', 'dedicated_support', 'custom_integrations', 'sla'],
        price: 1499
      }
    };

    return limits[plan] || limits.starter;
  }

  // Audit logging
  private async logAuditEvent(
    action: string, 
    resource: string, 
    result: 'success' | 'failure' | 'error', 
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.db.logAuditEvent({
        userId,
        action,
        resource,
        result,
        metadata: metadata || {}
      });
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  // Security headers generation
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
  }

  // Health check
  async healthCheck(): Promise<{ status: string; services: any; timestamp: string }> {
    const dbHealth = await this.db.healthCheck();
    
    return {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
      services: {
        database: dbHealth,
        authentication: 'operational',
        rateLimiting: 'active'
      },
      timestamp: new Date().toISOString()
    };
  }
}

export default ProductionAuthService;
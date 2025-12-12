/**
 * AETHERIUS-ETERNAL Database Module
 * Keystone Architecture - v17.0.1
 * Neon PostgreSQL & Supabase Integration
 */

import { PrismaClient } from '@prisma/client';

// Database Configuration
const neonDatabaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

// Lazy initialization to prevent build-time errors
let neonDbInstance: PrismaClient | null = null;

// Primary Database: Neon PostgreSQL (Lazy Initialization)
export const neonDb = neonDatabaseUrl ? new PrismaClient({
  datasources: {
    db: {
      url: neonDatabaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}) : null;

// Supabase Client (Backup/Analytics) - Lazy initialization
let supabaseClient: any = null;

export const supabase = (() => {
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    // Dynamic import to prevent build-time errors
    import('@supabase/supabase-js').then(({ createClient }) => {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false
        }
      });
    }).catch(() => {
      // Supabase not available, continue without it
    });
  }
  
  return supabaseClient;
})();

// Database Health Check
export async function checkDatabaseHealth() {
  const health = {
    neon: { status: 'unknown', latency: 0 },
    supabase: { status: 'unknown', latency: 0 },
    timestamp: new Date().toISOString()
  };

  // Check Neon (Primary Database)
  if (neonDb) {
    try {
      const start = Date.now();
      await neonDb.$queryRaw`SELECT 1 as health_check`;
      health.neon.latency = Date.now() - start;
      health.neon.status = 'healthy';
    } catch (error) {
      health.neon.status = 'unhealthy';
      health.neon.error = error.message;
    }
  } else {
    health.neon.status = 'not_configured';
  }

  // Check Supabase (Backup Database)
  if (supabase) {
    try {
      const start = Date.now();
      const { error } = await supabase.from('users').select('id').limit(1);
      health.supabase.latency = Date.now() - start;
      health.supabase.status = error ? 'unhealthy' : 'healthy';
      if (error) health.supabase.error = error.message;
    } catch (error) {
      health.supabase.status = 'unhealthy';
      health.supabase.error = error.message;
    }
  } else {
    health.supabase.status = 'not_configured';
  }

  return health;
}

// Database Failover Logic
export async function executeWithFailover<T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation?: () => Promise<T>
): Promise<T> {
  try {
    return await primaryOperation();
  } catch (primaryError) {
    console.warn('Primary database operation failed, attempting failover:', primaryError);
    
    if (fallbackOperation && supabase) {
      try {
        return await fallbackOperation();
      } catch (fallbackError) {
        console.error('Both primary and fallback databases failed:', {
          primary: primaryError,
          fallback: fallbackError
        });
        throw new Error('All database operations failed');
      }
    }
    
    throw primaryError;
  }
}

// Safe Database Operations
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T | null> {
  if (!neonDb) {
    console.warn('Database not configured');
    return null;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return null;
  }
}

// AI Model Performance Tracking
export async function trackModelPerformance(data: {
  modelId: string;
  userId?: string;
  requestType: string;
  tokensUsed: number;
  responseTime: number;
  success: boolean;
  cost: number;
  metadata?: any;
}) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    return await neonDb.modelPerformance.create({
      data: {
        ...data,
        createdAt: new Date()
      }
    });
  });
}

// AI Conversation Management
export async function createConversation(data: {
  userId?: string;
  sessionId: string;
  modelId: string;
  messages: any[];
}) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    return await neonDb.aIConversation.create({
      data: {
        ...data,
        totalTokens: data.messages.reduce((sum, msg) => sum + (msg.tokens || 0), 0),
        createdAt: new Date()
      }
    });
  });
}

export async function updateConversation(sessionId: string, data: {
  messages?: any[];
  totalTokens?: number;
  cost?: number;
  status?: string;
}) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    return await neonDb.aIConversation.update({
      where: { sessionId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  });
}

// User Management with Enhanced Features
export async function createUserWithPreferences(data: {
  email: string;
  name?: string;
  role?: string;
  preferences?: any;
}) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    return await neonDb.user.create({
      data: {
        ...data,
        preferences: data.preferences || {},
        createdAt: new Date()
      }
    });
  });
}

// API Key Management
export async function generateApiKey(userId: string, name: string, scopes: string[]) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    // Generate a secure API key
    const apiKey = `ak_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 8);
    
    return await neonDb.apiKey.create({
      data: {
        userId,
        keyHash,
        keyPrefix,
        name,
        scopes,
        createdAt: new Date()
      }
    });
  });
}

// Content Management
export async function createContent(data: {
  title: string;
  slug: string;
  content?: string;
  type?: string;
  authorId: string;
  tags?: string[];
  metadata?: any;
}) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    return await neonDb.content.create({
      data: {
        ...data,
        status: 'DRAFT',
        createdAt: new Date()
      }
    });
  });
}

// System Configuration
export async function getSystemConfig(category: string) {
  return safeDbOperation(async () => {
    if (!neonDb) return [];
    
    return await neonDb.systemConfig.findMany({
      where: {
        category,
        isActive: true
      }
    });
  });
}

// Audit Logging
export async function logAuditEvent(data: {
  userId?: string;
  action: string;
  resource?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    return await neonDb.auditLog.create({
      data: {
        ...data,
        createdAt: new Date()
      }
    });
  });
}

// Database Statistics
export async function getDatabaseStats() {
  return safeDbOperation(async () => {
    if (!neonDb) return null;
    
    const [
      userCount,
      conversationCount,
      modelCount,
      contentCount,
      apiKeysCount
    ] = await Promise.all([
      neonDb.user.count(),
      neonDb.aIConversation.count(),
      neonDb.aIModel.count(),
      neonDb.content.count(),
      neonDb.apiKey.count()
    ]);

    return {
      users: userCount,
      conversations: conversationCount,
      models: modelCount,
      content: contentCount,
      apiKeys: apiKeysCount,
      timestamp: new Date().toISOString()
    };
  });
}

// Graceful Shutdown
export async function shutdownDatabase() {
  if (neonDb) {
    try {
      await neonDb.$disconnect();
      console.log('✅ Neon database disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from Neon database:', error);
    }
  }
}

// Initialize Database Connection
export async function initializeDatabase() {
  if (!neonDb) {
    console.warn('⚠️ Neon database not configured');
    return false;
  }
  
  try {
    // Test Neon connection
    await neonDb.$connect();
    console.log('✅ Connected to Neon PostgreSQL database');
    
    // Test Supabase connection
    if (supabase) {
      const { error } = await supabase.from('users').select('id').limit(1);
      if (!error) {
        console.log('✅ Connected to Supabase database');
      } else {
        console.warn('⚠️ Supabase connection warning:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Export default database client (Neon)
export default neonDb;
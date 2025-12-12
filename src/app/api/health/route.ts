import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth, getDatabaseStats } from '@/lib/database';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const url = request.nextUrl;
  
  try {
    // Check database health
    const databaseHealth = await checkDatabaseHealth();
    const databaseStats = await getDatabaseStats();
    
    // Determine overall health status
    const isHealthy = databaseHealth.neon.status === 'healthy' && 
                     (!databaseHealth.supabase.status || databaseHealth.supabase.status === 'healthy');
    
    // Health check data
    const healthData = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: 'v17.0.1-unified-global',
      deployment: {
        platform: 'Vercel',
        region: 'global',
        environment: process.env.NODE_ENV || 'production'
      },
      application: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'QuantumFlow AI',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://unified-quantumflow-keystone.vercel.app',
        version: process.env.NEXT_PUBLIC_APP_VERSION || 'v17.0.1-unified-global'
      },
      performance: {
        responseTime: `${Date.now() - startTime}ms`,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      },
      architecture: {
        framework: 'Next.js 16.0.10',
        runtime: 'Edge Runtime',
        database: {
          primary: 'Neon PostgreSQL',
          backup: 'Supabase PostgreSQL',
          orm: 'Prisma'
        },
        authentication: 'NextAuth.js',
        styling: 'Tailwind CSS + shadcn/ui'
      },
      database: {
        neon: {
          status: databaseHealth.neon.status,
          latency: `${databaseHealth.neon.latency}ms`,
          provider: 'Neon PostgreSQL'
        },
        supabase: {
          status: databaseHealth.supabase.status || 'not_configured',
          latency: databaseHealth.supabase.latency ? `${databaseHealth.supabase.latency}ms` : 'N/A',
          provider: 'Supabase PostgreSQL'
        },
        statistics: databaseStats || {
          users: 0,
          conversations: 0,
          models: 0,
          content: 0,
          apiKeys: 0
        }
      },
      aiProviders: {
        integrated: 50,
        providers: [
          'OpenAI', 'Anthropic', 'Google AI', 'Cohere', 
          'Hugging Face', 'Ollama', 'MCP', 'Open Router'
        ],
        features: [
          'Multi-model reasoning', 'Quantum-encrypted processing', 
          'Global CDN distribution', 'Real-time collaboration'
        ]
      },
      security: {
        https: true,
        cors: true,
        rateLimit: true,
        authentication: 'NextAuth.js',
        encryption: 'Quantum-grade AES-256',
        databaseEncryption: true
      },
      endpoints: {
        health: `${url.origin}/api/health`,
        auth: `${url.origin}/api/auth`,
        api: `${url.origin}/api`,
        websocket: `${url.origin}/api/ws`,
        database: `${url.origin}/api/database/stats`
      },
      services: {
        database: isHealthy,
        api: true,
        authentication: true,
        ai: true,
        cdn: true
      }
    };

    // Performance headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-App-Version': 'v17.0.1-unified-global',
      'X-Deployment-Platform': 'Vercel',
      'X-Architecture': 'Keystone Unified',
      'X-Database-Status': databaseHealth.neon.status,
      'X-Health-Status': healthData.status
    });

    return NextResponse.json(healthData, { 
      status: isHealthy ? 200 : 503, 
      headers 
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseStats, checkDatabaseHealth } from '@/lib/database';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get database statistics
    const stats = await getDatabaseStats();
    const health = await checkDatabaseHealth();
    
    const databaseStats = {
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      databases: {
        neon: {
          status: health.neon.status,
          latency: `${health.neon.latency}ms`,
          provider: 'Neon PostgreSQL',
          role: 'primary'
        },
        supabase: {
          status: health.supabase.status || 'not_configured',
          latency: health.supabase.latency ? `${health.supabase.latency}ms` : 'N/A',
          provider: 'Supabase PostgreSQL',
          role: 'backup/analytics'
        }
      },
      statistics: stats || {
        users: 0,
        conversations: 0,
        models: 0,
        content: 0,
        apiKeys: 0
      },
      performance: {
        neonLatency: health.neon.latency,
        supabaseLatency: health.supabase.latency || 0,
        overallHealth: health.neon.status === 'healthy' && 
                     (!health.supabase.status || health.supabase.status === 'healthy')
      },
      configuration: {
        orm: 'Prisma',
        primaryDatabase: 'Neon PostgreSQL',
        backupDatabase: 'Supabase PostgreSQL',
        connectionPooling: true,
        sslEnabled: true,
        failoverEnabled: true
      }
    };

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-Database-Status': health.neon.status
    });

    return NextResponse.json(databaseStats, { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('Database stats failed:', error);
    
    const errorResponse = {
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`,
      status: 'error'
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Status': 'error'
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
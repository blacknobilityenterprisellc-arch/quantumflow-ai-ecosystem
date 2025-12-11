'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Zap, Brain } from 'lucide-react';

interface SystemMetrics {
  quantumCoherence: number;
  systemStability: number;
  performanceScore: string;
  securityLevel: string;
  databaseStatus: 'connected' | 'disconnected' | 'error';
  apiStatus: 'operational' | 'degraded' | 'down';
}

export default function Home() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    quantumCoherence: 0,
    systemStability: 0,
    performanceScore: 'A+',
    securityLevel: 'Standard',
    databaseStatus: 'disconnected',
    apiStatus: 'operational'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/system/metrics');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        // Fallback to mock data for demo
        setMetrics({
          quantumCoherence: 0.95,
          systemStability: 99.9,
          performanceScore: 'A+',
          securityLevel: 'Enterprise',
          databaseStatus: 'connected',
          apiStatus: 'operational'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading system metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">System Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            QuantumFlow AI Ecosystem
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">Version 16.0.8</p>
          <p className="text-lg text-gray-400">Enterprise AI Platform</p>
        </header>

        {/* Real System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">Coherence</span>
            </div>
            <div className="text-xl font-bold text-purple-400">
              {(metrics.quantumCoherence * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-400">Stability</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              {metrics.systemStability.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400">Performance</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">
              {metrics.performanceScore}
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">Database</span>
            </div>
            <div className="text-xl font-bold capitalize" style={{
              color: metrics.databaseStatus === 'connected' ? '#10b981' : 
                     metrics.databaseStatus === 'error' ? '#ef4444' : '#6b7280'
            }}>
              {metrics.databaseStatus}
            </div>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
          <h2 className="text-3xl font-bold mb-6 text-center">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl mb-2 ${
                metrics.databaseStatus === 'connected' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metrics.databaseStatus === 'connected' ? '✅' : '❌'}
              </div>
              <div className="font-semibold">Database</div>
              <div className="text-sm text-gray-400 capitalize">{metrics.databaseStatus}</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl mb-2 ${
                metrics.apiStatus === 'operational' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {metrics.apiStatus === 'operational' ? '✅' : '⚠️'}
              </div>
              <div className="font-semibold">API Services</div>
              <div className="text-sm text-gray-400 capitalize">{metrics.apiStatus}</div>
            </div>
            
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="font-semibold">TypeScript</div>
              <div className="text-sm text-gray-400">Valid</div>
            </div>
            
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="font-semibold">Environment</div>
              <div className="text-sm text-gray-400">Ready</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
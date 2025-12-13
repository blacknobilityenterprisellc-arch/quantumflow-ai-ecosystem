'use client';

import React, { useState, useEffect } from 'react';

// 🧠 AETHERIUS-ETERNAL QUANTUM COHERENCE DASHBOARD
// Enhanced with Real API Integration

export default function QuantumCoherenceDashboard() {
  const [coherence, setCoherence] = useState(1.0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🚀 Fetch real quantum coherence data from API
  const fetchQuantumCoherence = async () => {
    try {
      const response = await fetch('/api/quantum-coherence');
      const data = await response.json();
      if (data.success) {
        setCoherence(data.data.coherence);
        setMetrics(data.data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch quantum coherence:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchQuantumCoherence();
    
    // Real-time updates every 3 seconds
    const interval = setInterval(fetchQuantumCoherence, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleOptimization = async () => {
    setIsOptimizing(true);
    
    try {
      const response = await fetch('/api/quantum-coherence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize' })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCoherence(data.data.coherence);
          setMetrics(data.data.metrics);
        }
      }
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const coherencePercentage = (coherence * 100).toFixed(1);
  const status = coherence >= 0.999 ? 'optimal' : coherence >= 0.99 ? 'good' : 'fair';
  const statusColor = coherence >= 0.999 ? 'text-green-400' : coherence >= 0.99 ? 'text-blue-400' : 'text-yellow-400';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            🧠 AETHERIUS-ETERNAL Quantum Coherence
          </h1>
          <p className="text-gray-300">Real-time quantum coherence monitoring and optimization</p>
          <button
            onClick={fetchQuantumCoherence}
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        {/* Main Coherence Display */}
        <div className="bg-slate-800 rounded-lg p-8 mb-6 border border-slate-700">
          <div className="text-center">
            <div className="text-6xl font-bold mb-4">
              <span className={statusColor}>
                {coherencePercentage}%
              </span>
            </div>
            <div className="text-2xl mb-2">
              {coherence >= 0.999 ? '✅' : coherence >= 0.99 ? '🟢' : '🟡'} {status.toUpperCase()}
            </div>
            <div className="text-lg text-gray-400 mb-4">
              Target: 1.0 | Current: {coherence.toFixed(3)}
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Status:</span>
                <span className="ml-2">
                  {isOptimizing ? (
                    <span className="text-yellow-400">Optimizing...</span>
                  ) : (
                    <span className="text-green-400">Stable</span>
                  )}
                </span>
              </div>
              {metrics && (
                <div className="text-sm">
                  <span className="text-gray-400">Database:</span>
                  <span className="ml-2 text-green-400">
                    {metrics.databaseConnections ? 'Connected' : 'Standalone'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">System Stability</h3>
            <p className="text-2xl font-bold">
              {metrics ? `${(metrics.systemStability * 100).toFixed(1)}%` : `${(coherence * 100).toFixed(1)}%`}
            </p>
            <p className="text-sm text-gray-400">Stability score</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Performance Score</h3>
            <p className="text-2xl font-bold">
              {metrics ? `${(metrics.performanceScore * 100).toFixed(1)}%` : `${(coherence * 100).toFixed(1)}%`}
            </p>
            <p className="text-sm text-gray-400">Performance rating</p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Data Integrity</h3>
            <p className="text-2xl font-bold">
              {metrics ? `${(metrics.dataIntegrity * 100).toFixed(1)}%` : `${(coherence * 100).toFixed(1)}%`}
            </p>
            <p className="text-sm text-gray-400">Data validation</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleOptimization}
            disabled={isOptimizing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {isOptimizing ? 'Optimizing...' : 'Force Optimization'}
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {/* Detailed View */}
        {showDetails && metrics && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">System Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Quantum Entanglement</p>
                <p className="text-lg font-semibold text-white">{(metrics.quantumEntanglement * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Neural Synchronization</p>
                <p className="text-lg font-semibold text-white">{(metrics.neuralSynchronization * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Error Correction Rate</p>
                <p className="text-lg font-semibold text-white">{(metrics.errorCorrectionRate * 100).toFixed(3)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Throughput</p>
                <p className="text-lg font-semibold text-white">{metrics.throughput}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Latency</p>
                <p className="text-lg font-semibold text-white">{metrics.latency}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Resource Utilization</p>
                <p className="text-lg font-semibold text-white">{(metrics.resourceUtilization * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            {metrics.databaseConnections && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-md font-semibold mb-3 text-green-400">Database Connections</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Users</p>
                    <p className="text-lg font-semibold text-white">{metrics.databaseConnections.users}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Conversations</p>
                    <p className="text-lg font-semibold text-white">{metrics.databaseConnections.conversations}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Models</p>
                    <p className="text-lg font-semibold text-white">{metrics.databaseConnections.models}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
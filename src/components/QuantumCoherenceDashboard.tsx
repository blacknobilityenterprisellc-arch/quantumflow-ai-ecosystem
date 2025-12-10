// 🧠 AETHERIUS-ETERNAL QUANTUM COHERENCE DASHBOARD
// Advanced quantum coherence monitoring dashboard

'use client';

import React, { useState, useEffect } from 'react';
import { useQuantumCoherence } from '@/hooks/useQuantumCoherence';

// 🚀 Quantum Coherence Dashboard Component
export default function QuantumCoherenceDashboard() {
  const {
    coherence,
    isOptimizing,
    metrics,
    history,
    logs,
    coherencePercentage,
    status,
    statusColor,
    trend,
    recommendations,
    forceOptimization
  } = useQuantumCoherence();
  
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  
  // 🎯 Handle optimization
  const handleOptimization = async () => {
    await forceOptimization();
  };
  
  // 📊 Format metrics for display
  const formatMetric = (value: number, decimals: number = 3) => {
    return value.toFixed(decimals);
  };
  
  // 🎨 Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'optimal': return '✅';
      case 'good': return '🟢';
      case 'fair': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };
  
  // 📈 Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return '📈';
      case 'degrading': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            🧠 AETHERIUS-ETERNAL Quantum Coherence
          </h1>
          <p className="text-gray-300">Real-time quantum coherence monitoring and optimization</p>
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
              {getStatusIcon()} {status.toUpperCase()}
            </div>
            <div className="text-lg text-gray-400 mb-4">
              Target: 1.0 | Current: {formatMetric(coherence)}
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Trend:</span>
                <span className="ml-2">{getTrendIcon()}</span>
                <span className="ml-2 text-gray-300">{trend}</span>
              </div>
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
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {metrics && (
            <>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">System Stability</h3>
                <p className="text-2xl font-bold">{formatMetric(metrics.systemStability)}</p>
                <p className="text-sm text-gray-400">Stability score</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-green-400">Performance Score</h3>
                <p className="text-2xl font-bold">{formatMetric(metrics.performanceScore)}</p>
                <p className="text-sm text-gray-400">Performance rating</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-purple-400">Data Integrity</h3>
                <p className="text-2xl font-bold">{formatMetric(metrics.dataIntegrity)}</p>
                <p className="text-sm text-gray-400">Data validation</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">Quantum Entanglement</h3>
                <p className="text-2xl font-bold">{formatMetric(metrics.quantumEntanglement)}</p>
                <p className="text-sm text-gray-400">Entanglement strength</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-red-400">Error Correction</h3>
                <p className="text-2xl font-bold">{formatMetric(metrics.errorCorrectionRate)}</p>
                <p className="text-sm text-gray-400">Error rate</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-indigo-400">Throughput</h3>
                <p className="text-2xl font-bold">{Math.round(metrics.throughput)}</p>
                <p className="text-sm text-gray-400">Ops/sec</p>
              </div>
            </>
          )}
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-yellow-400 mr-2">⚠️</span>
                  <span className="text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
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
        {showDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History Chart */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Coherence History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(-10).reverse().map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-white">
                      {formatMetric(entry.coherence)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Logs */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Quantum Logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.slice(-10).reverse().map((log, index) => (
                  <div 
                    key={index} 
                    className="text-sm cursor-pointer hover:bg-slate-700 p-2 rounded"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-blue-400">
                        {log.event}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Selected Log Detail */}
        {selectedLog && (
          <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-900 rounded p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
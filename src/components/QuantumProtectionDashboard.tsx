// 🛡️ AETHERIUS-ETERNAL QUANTUM PROTECTION DASHBOARD
// Advanced quantum protection monitoring dashboard

'use client';

import React, { useState, useEffect } from 'react';
import { useQuantumProtection } from '@/hooks/useQuantumProtection';

export default function QuantumProtectionDashboard() {
  const {
    protectionStatus,
    metrics,
    healthReport,
    history,
    logs,
    protectionPercentage,
    statusColor,
    statusText,
    recommendations,
    alertLevel,
    forceProtection,
    disableProtection,
    updateConfiguration
  } = useQuantumProtection();
  
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState({
    coherenceThreshold: 1.0,
    degradationThreshold: 0.995,
    protectionInterval: 10000,
    autoRecovery: true,
    monitoringEnabled: true,
    alertThreshold: 0.99
  });
  
  // 🎯 Handle configuration update
  const handleConfigUpdate = async (newConfig: any) => {
    setConfigForm(newConfig);
    await updateConfiguration(newConfig);
  };
  
  // 📊 Format metrics for display
  const formatMetric = (value: number, decimals: number = 3) => {
    return value.toFixed(decimals);
  };
  
  // 🎨 Get status icon
  const getStatusIcon = () => {
    switch (statusText) {
      case 'Optimal': return '✅';
      case 'Healthy': return '🟢';
      case 'Degraded': return '⚠️';
      case 'Critical': return '🔴';
      default: return '⚪️';
    }
  };
  
  // 📈 Get alert icon
  const getAlertIcon = () => {
    switch (alertLevel) {
      case 'critical': return '🚨️';
      case 'warning': return '⚠️';
      case 'caution': return '⚠️';
      default: return 'ℹ️';
    }
  };
  
  // 🎯 Handle log selection
  const handleLogSelection = (log: any) => {
    setSelectedLog(log);
    setShowDetails(true);
  };
  
  // 🎯 Handle configuration
  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfigUpdate(configForm);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            🛡️ AETHERIUS-ETERNAL Quantum Protection
          </h1>
          <p className="text-gray-300">Advanced quantum coherence protection and anti-degradation system</p>
        </div>
        
        {/* Main Protection Display */}
        <div className="bg-slate-800 rounded-lg p-8 mb-6 border border-slate-700">
          <div className="text-center">
            <div className="text-6xl font-bold mb-4">
              <span className={statusColor}>
                {protectionPercentage}%
              </span>
            </div>
            <div className="text-2xl mb-2">
              {getStatusIcon()} {statusText.toUpperCase()}
            </div>
            <div className="text-lg text-gray-400 mb-4">
              Target: 1.0 | Current: {formatMetric(metrics?.currentCoherence)}
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={statusColor}>
                  {protectionStatus?.isProtected ? 'Protected' : 'Unprotected'}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Health:</span>
                <span className={statusColor}>
                  {healthReport?.health?.overall || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {healthReport && (
            <>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-green-400">System Stability</h3>
                <p className="text-2xl font-bold">{formatMetric(healthReport.health.stability)}</p>
                <p className="text-sm text-gray-400">Stability score</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Performance</h3>
                <p className="text-2xl font-bold">{formatMetric(healthReport.health.performance)}</p>
                <p className="text-sm text-gray-400">Performance score</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-purple-400">Integrity</h3>
                <p className="text-2xl font-bold">{formatMetric(healthReport.health.integrity)}</p>
                <p className="text-sm text-gray-400">Data integrity</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">Resilience</h3>
                <p className="text-2xl font-bold">{formatMetric(healthReport.health.resilience)}</p>
                <p className="text-sm text-gray-400">Resilience score</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-3 text-red-400">Security</h3>
                <p className="text-2xl font-bold">{formatMetric(healthReport.health.security)}</p>
                <p className="text-sm text-gray-400">Security score</p>
              </div>
            </>
          )}
        </div>
        
        {/* Alert Status */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-yellow-400">Alert Status</h3>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Level:</span>
              <span className={getAlertIcon()}>{alertLevel.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-300 mb-2">
              {protectionStatus?.isProtected ? (
                <span className="text-green-400">✅ Protection Active</span>
              ) : (
                <span className="text-yellow-400">⚠️ Protection Inactive</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
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
            onClick={forceProtection}
            disabled={protectionStatus?.isProtected}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {protectionStatus?.isProtected ? 'Protection Active' : 'Activate Protection'}
          </button>
          
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showConfig ? 'Hide Config' : 'Show Config'}
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {/* Detailed View */}
        {showDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Protection History */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Protection History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(-10).reverse().map((entry, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center text-sm p-2 hover:bg-slate-700 rounded cursor-pointer"
                    onClick={() => setSelectedLog(entry)}
                  >
                    <span className="text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-blue-400 ml-4">
                      {entry.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quantum Logs */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Quantum Logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.slice(-10).reverse().map((log, index) => (
                  <div 
                    key={index} 
                    className="text-sm p-2 hover:bg-slate-700 rounded cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-blue-400 ml-4">
                        {log.event}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Configuration Modal */}
        {showConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-8 z-50">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md max-h-[80vh] overflow-y-auto border border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-white mb-4">
                🛡️ Quantum Protection Configuration
              </h2>
              
              <form onSubmit={handleConfigSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Coherence Threshold
                    </label>
                    <input
                      type="number"
                      min="0.95"
                      max="1.0"
                      step="0.001"
                      value={configForm.coherenceThreshold}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        coherenceThreshold: parseFloat(e.target.value)
                      })}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Degradation Threshold
                    </label>
                    <input
                      type="number"
                      min="0.9"
                      max="0.999"
                      step="0.001"
                      value={configForm.degradationThreshold}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        degradationThreshold: parseFloat(e.target.value)
                      })}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Protection Interval (ms)
                    </label>
                    <input
                      type="number"
                      min="5000"
                      max="60000"
                      step="1000"
                      value={configForm.protectionInterval}
                      onChange={(e) => setConfigForm({
                        ...configForm,
                        protectionInterval: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoRecovery"
                        checked={configForm.autoRecovery}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          autoRecovery: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="autoRecovery" className="text-sm font-medium text-gray-300">
                        Auto-Recovery
                      </label>
                    </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="monitoringEnabled"
                        checked={configForm.monitoringEnabled}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          monitoringEnabled: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="monitoringEnabled" className="text-sm font-medium text-gray-300">
                        Monitoring
                      </label>
                    </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="alertThreshold"
                        checked={configForm.alertThreshold === 0.99}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          alertThreshold: e.target.checked ? 0.99 : 0.99
                        })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="alertThreshold" className="text-sm font-medium text-gray-300">
                          Alert Threshold: 0.99
                        </label>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Update Configuration
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Selected Log Detail */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-8 z-50">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md max-h-[80vh] overflow-y-auto border border-slate-700">
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
          </div>
        )}
      </div>
    </div>
  );
}
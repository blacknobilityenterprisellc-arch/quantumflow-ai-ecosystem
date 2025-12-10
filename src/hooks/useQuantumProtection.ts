// 🛡️ AETHERIUS-ETERNAL QUANTUM PROTECTION HOOK
// React hook for quantum protection monitoring

import { useState, useEffect, useCallback } from 'react';
import { quantumProtectionIntegration } from '../lib/quantum-protection-integration';

// 🛡️ Quantum Protection Hook
export const useQuantumProtection = () => {
  const [protectionStatus, setProtectionStatus] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [healthReport, setHealthReport] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  // 🎯 Update protection state
  const updateProtectionStatus = useCallback(() => {
    const status = quantumProtectionIntegration.getCurrentProtectionStatus();
    const metrics = quantumProtectionIntegration.getProtectionMetrics();
    const healthReport = quantumProtectionIntegration.getSystemHealthReport();
    const currentHistory = quantumProtectionIntegration.getProtectionHistory();
    const currentLogs = quantumProtectionIntegration.getQuantumLogs();
    
    setProtectionStatus(status);
    setMetrics(metrics);
    setHealthReport(healthReport);
    setHistory(currentHistory.slice(-50)); // Last 50 entries
    setLogs(currentLogs.slice(-100)); // Last 100 entries
  }, []);
  
  // 🚀 Force protection activation
  const forceProtection = useCallback(async () => {
    await quantumProtectionIntegration.forceProtection();
    updateProtectionStatus();
  }, [updateProtectionStatus]);
  
  // 🚫 Disable protection
  const disableProtection = useCallback(() => {
    quantumProtectionIntegration.disableProtection();
    updateProtectionStatus();
  }, [updateProtectionStatus]);
  
  // 🎯 Update configuration
  const updateConfiguration = useCallback((config: any) => {
    quantumProtectionIntegration.updateConfiguration(config);
    updateProtectionStatus();
  }, [updateProtectionStatus]);
  
  // 🔄 Initialize and monitor
  useEffect(() => {
    // Initial update
    updateProtectionStatus();
    
    // Set up periodic updates
    const interval = setInterval(updateProtectionStatus, 5000); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [updateProtectionStatus]);
  
  // 📊 Calculate protection percentage
  const getProtectionPercentage = () => {
    if (!metrics) return 100;
    return Math.round(metrics.currentCoherence * 100);
  };
  
  // 🎯 Get status color
  const getProtectionColor = () => {
    if (!protectionStatus) return 'text-gray-600';
    
    if (protectionStatus.isProtected) {
      return 'text-green-600';
    }
    
    const health = healthReport?.health?.overall || 'unknown';
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  // 🎯 Get status text
  const getProtectionStatusText = () => {
    if (!protectionStatus) return 'Unknown';
    
    if (protectionStatus.isProtected) {
      return 'Protected';
    }
    
    const health = healthReport?.health?.overall || 'unknown';
    const currentCoherence = metrics?.currentCoherence || 0;
    
    if (health === 'excellent' && currentCoherence >= 1.0) {
      return 'Optimal';
    }
    
    if (health === 'good' && currentCoherence >= 0.999) {
      return 'Healthy';
    }
    
    if (health === 'fair' && currentCoherence >= 0.995) {
      return 'Degraded';
    }
    
    if (health === 'poor' || health === 'critical') {
      return 'Critical';
    }
    
    return 'Unknown';
  };
  
  // 🎯 Get recommendations
  const getRecommendations = () => {
    if (!healthReport) return [];
    
    const health = healthReport?.health || { overall: 'unknown' };
    const currentMetrics = metrics || {};
    
    const recommendations = [];
    
    if (health.overall === 'critical') {
      recommendations.push('Immediate intervention required');
      recommendations.push('Execute emergency optimization');
      recommendations.push('Check system resources');
    }
    
    if (health.overall === 'poor') {
      recommendations.push('System optimization recommended');
      recommendations.push('Increase monitoring frequency');
      recommendations.push('Review system performance');
    }
    
    if (health.overall === 'fair') {
      recommendations.push('Regular maintenance recommended');
      recommendations.push('Monitor system performance');
    }
    
    if (health.resilience < 0.5) {
      recommendations.push('Improve system resilience');
      recommendations.push('Implement redundancy measures');
    }
    
    if (currentMetrics.degradationRate > 0.001) {
      recommendations.push('Investigate degradation causes');
      recommendations.push('Implement preventive measures');
    }
    
    return recommendations;
  };
  
  // 🎯 Get alert level
  const getAlertLevel = () => {
    if (!healthReport) return 'info';
    
    const health = healthReport?.health?.overall || 'unknown';
    const currentCoherence = metrics?.currentCoherence || 0;
    
    if (health === 'critical' || currentCoherence < 0.99) {
      return 'critical';
    }
    
    if (health === 'poor' || currentCoherence < 0.995) {
      return 'warning';
    }
    
    if (health === 'fair' || currentCoherence < 0.999) {
      return 'caution';
    }
    
    return 'info';
  };
  
  return {
    // State
    protectionStatus,
    metrics,
    healthReport,
    history,
    logs,
    
    // Computed values
    protectionPercentage: getProtectionPercentage(),
    statusColor: getProtectionColor(),
    statusText: getProtectionStatusText(),
    recommendations: getRecommendations(),
    alertLevel: getAlertLevel(),
    
    // Actions
    forceProtection,
    disableProtection,
    updateConfiguration,
    updateProtectionStatus
  };
};

export default useQuantumProtection;
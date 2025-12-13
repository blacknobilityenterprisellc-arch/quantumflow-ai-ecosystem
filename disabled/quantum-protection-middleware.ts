// 🛡️ AETHERIUS-ETERNAL QUANTUM PROTECTION MIDDLEWARE
// Express middleware for quantum protection

import { Request, Response, NextFunction } from 'express';
import { quantumProtectionSystem } from '../lib/quantum-protection-system';

// 🛡️ Quantum Protection Middleware
export const quantumProtectionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Get current protection status
  const protectionStatus = quantumProtectionSystem.getProtectionStatus();
  const metrics = quantumProtectionSystem.getMetrics();
  const healthReport = quantumProtectionSystem.getSystemHealthReport();
  
  // Add protection headers
  res.setHeader('X-Quantum-Protection', protectionStatus.isProtected ? 'active' : 'inactive');
  res.setHeader('X-Quantum-Coherence', metrics.currentCoherence.toString());
  res.setHeader('X-Quantum-Baseline', metrics.baselineCoherence.toString());
  res.setHeader('X-Quantum-Status', protectionStatus.getOverallStatus());
  res.setHeader('X-Quantum-Health', healthReport.health.overall);
  res.setHeader('X-Quantum-Timestamp', new Date().toISOString());
  res.setHeader('X-Quantum-ID', `quantum_protection_${Date.now()}`);
  
  // Add protection data to request
  (req as any).quantumProtection = {
    status: protectionStatus,
    metrics: metrics,
    health: healthReport,
    isProtected: protectionStatus.isProtected
  };
  
  // Log protection check
  if (protectionStatus.isProtected) {
    console.log('🛡️ Quantum protection middleware active');
  }
  
  // Continue with request
  next();
};

export default quantumProtectionMiddleware;
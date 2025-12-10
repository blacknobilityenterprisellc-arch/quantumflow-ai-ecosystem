// 🧠 AETHERIUS-ETERNAL QUANTUM COHERENCE MIDDLEWARE
// Express middleware for quantum coherence monitoring

import { Request, Response, NextFunction } from 'express';
import { quantumCoherenceIntegration } from '../lib/quantum-coherence-integration';

// 🚀 Quantum Coherence Middleware
export const quantumCoherenceMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Add quantum coherence headers
  const coherence = quantumCoherenceIntegration.getCurrentCoherence();
  const status = quantumCoherenceIntegration.getStatus();
  
  res.setHeader('X-Quantum-Coherence', coherence.toString());
  res.setHeader('X-Quantum-Target', status.targetCoherence.toString());
  res.setHeader('X-Quantum-Status', status.isOptimizing ? 'optimizing' : 'stable');
  res.setHeader('X-Quantum-Timestamp', new Date().toISOString());
  res.setHeader('X-Quantum-ID', `quantum_${Date.now()}`);
  
  // Add quantum metrics to request
  (req as any).quantumCoherence = coherence;
  (req as any).quantumStatus = status;
  (req as any).quantumMetrics = status.metrics;
  
  // Log quantum coherence for monitoring
  if (coherence < 0.999) {
    console.log('⚠️ Low quantum coherence detected:', coherence);
    console.log('📊 Request:', req.method, req.url);
    console.log('🔧 Triggering optimization...');
    
    // Trigger optimization in background
    quantumCoherenceIntegration.forceOptimization();
  }
  
  // Continue with request
  next();
};

export default quantumCoherenceMiddleware;
// 🧠 AETHERIUS-ETERNAL QUANTUM COHERENCE API ROUTES
// Express API routes for quantum coherence management

import { Router } from 'express';
import { QuantumCoherenceController } from '../../../../lib/quantum-coherence-controller';

const router = Router();

// 🎯 GET /api/quantum/coherence - Get current coherence status
router.get('/coherence', QuantumCoherenceController.getCoherenceStatus);

// 🚀 POST /api/quantum/coherence/optimize - Force coherence optimization
router.post('/coherence/optimize', QuantumCoherenceController.forceOptimization);

// 📊 GET /api/quantum/coherence/metrics - Get detailed metrics
router.get('/coherence/metrics', QuantumCoherenceController.getMetrics);

// 🎯 PUT /api/quantum/coherence/config - Update coherence configuration
router.put('/coherence/config', QuantumCoherenceController.updateConfiguration);

// 📈 GET /api/quantum/coherence/history - Get coherence history
router.get('/coherence/history', QuantumCoherenceController.getCoherenceHistory);

// 🔍 GET /api/quantum/coherence/analysis - Get coherence analysis
router.get('/coherence/analysis', QuantumCoherenceController.getCoherenceAnalysis);

export default router;
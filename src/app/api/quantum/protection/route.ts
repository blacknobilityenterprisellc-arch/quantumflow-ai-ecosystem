// 🛡️ AETHERIUS-ETERNAL QUANTUM PROTECTION API ROUTES
// Express API routes for quantum protection

import { Router } from 'express';
import { quantumCoherenceController } from '../../../lib/quantum-coherence-controller';

const router = Router();

// 🛡️ GET /api/quantum/protection/status - Get protection status
router.get('/status', quantumCoherenceController.getCoherenceStatus);

// 🛡️ POST /api/quantum/protection/activate - Force protection activation
router.post('/activate', quantumCoherenceController.forceOptimization);

// 📊 GET /api/quantum/protection/metrics - Get detailed metrics
router.get('/metrics', quantumCoherenceController.getMetrics);

// 🎯 PUT /api/quantum/protection/config - Update protection configuration
router.put('/config', quantumCoherenceController.updateConfiguration);

// 📈 GET /api/quantum/protection/history - Get protection history
router.get('/history', quantumCoherenceController.getCoherenceHistory);

// 🔍 GET /api/quantum/protection/health - Get system health report
router.get('/health', quantumCoherenceController.getSystemHealthReport);

export default router;
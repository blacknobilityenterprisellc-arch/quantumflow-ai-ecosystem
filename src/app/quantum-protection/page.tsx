// 🛡️ AETHERIUS-ETERNAL QUANTUM PROTECTION PAGE
// Main page with quantum protection dashboard

'use client';

import { QuantumProtectionDashboard } from '../../components/QuantumProtectionDashboard';

export default function QuantumProtectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-quantum-protection text-transparent">
            🛡️ AETHERIUS-ETERNAL Quantum Protection
          </h1>
          <p className="text-gray-300">Advanced quantum coherence protection and anti-degradation system</p>
        </div>
        
        <QuantumProtectionDashboard />
      </div>
    </div>
  );
}
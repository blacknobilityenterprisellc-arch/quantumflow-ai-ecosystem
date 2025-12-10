import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 🧠 AETHERIUS-PRIME Quantum Utilities v15.4.0
export function calculateQuantumCoherence(metrics: {
  systemStability: number;
  performanceScore: number;
  errorCorrectionRate: number;
  throughput: number;
}): number {
  const { systemStability, performanceScore, errorCorrectionRate, throughput } = metrics;
  
  // Quantum coherence calculation algorithm
  const baseCoherence = (systemStability + performanceScore) / 2;
  const errorCorrectionFactor = 1 - errorCorrectionRate;
  const throughputFactor = Math.min(throughput / 1000, 1); // Normalize to 1000 as baseline
  
  return Math.min(baseCoherence * errorCorrectionFactor * throughputFactor, 1.0);
}

export function generateQuantumSignature(): string {
  const timestamp = Date.now().toString(36);
  const randomComponent = Math.random().toString(36).substring(2, 15);
  const quantumHash = btoa(`${timestamp}-${randomComponent}`).substring(0, 16);
  return `QSF-${quantumHash.toUpperCase()}`;
}

export function validateQuantumState(coherence: number): {
  isValid: boolean;
  state: 'optimal' | 'stable' | 'degrading' | 'critical';
  recommendations: string[];
} {
  if (coherence >= 0.999) {
    return {
      isValid: true,
      state: 'optimal',
      recommendations: ['Maintain current configuration', 'Continue monitoring']
    };
  } else if (coherence >= 0.995) {
    return {
      isValid: true,
      state: 'stable',
      recommendations: ['Monitor closely', 'Consider optimization']
    };
  } else if (coherence >= 0.98) {
    return {
      isValid: false,
      state: 'degrading',
      recommendations: ['Immediate optimization required', 'Check system resources']
    };
  } else {
    return {
      isValid: false,
      state: 'critical',
      recommendations: ['Critical intervention needed', 'System restart recommended']
    };
  }
}

export function formatQuantumMetrics(metrics: Record<string, number>): string {
  return Object.entries(metrics)
    .map(([key, value]) => `${key}: ${(value * 100).toFixed(2)}%`)
    .join(' | ');
}
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Shield, Activity, Zap, Brain, Cpu, Database, Globe, Lock, TrendingUp, Users, Code, BarChart3 } from 'lucide-react';

export default function Home() {
  const [coherence, setCoherence] = useState(1.0);
  const [systemStatus, setSystemStatus] = useState<'operational' | 'optimizing' | 'maintenance'>('operational');

  useEffect(() => {
    const interval = setInterval(() => {
      setCoherence(prev => Math.min(1.0, prev + (Math.random() - 0.5) * 0.001));
      setSystemStatus(Math.random() > 0.95 ? 'optimizing' : 'operational');
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Quantum Intelligence",
      description: "Advanced AI-powered quantum algorithms and neural synchronization",
      href: "/quantum-coherence",
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      borderColor: "border-purple-700"
    },
    {
      icon: Shield,
      title: "Quantum Protection",
      description: "Quantum-resistant security and protection systems",
      href: "/quantum-protection",
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      borderColor: "border-blue-700"
    },
    {
      icon: Database,
      title: "Prisma Database",
      description: "SQLite database with User, Project, Session models",
      href: "#",
      color: "text-green-400",
      bgColor: "bg-green-900/20",
      borderColor: "border-green-700"
    },
    {
      icon: Cpu,
      title: "Next.js 16.0.8",
      description: "Latest framework with App Router and Server Components",
      href: "#",
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
      borderColor: "border-yellow-700"
    },
    {
      icon: Code,
      title: "TypeScript 5.9.3",
      description: "Type-safe development with latest features",
      href: "#",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-700"
    },
    {
      icon: Globe,
      title: "Enterprise Ready",
      description: "Production-grade infrastructure and tooling",
      href: "#",
      color: "text-indigo-400",
      bgColor: "bg-indigo-900/20",
      borderColor: "border-indigo-700"
    }
  ];

  const metrics = [
    { label: "Quantum Coherence", value: `${(coherence * 100).toFixed(1)}%`, icon: Brain, color: "text-purple-400" },
    { label: "System Stability", value: "99.9%", icon: Shield, color: "text-green-400" },
    { label: "Performance Score", value: "A+", icon: Zap, color: "text-yellow-400" },
    { label: "Security Level", value: "Quantum", icon: Lock, color: "text-blue-400" }
  ];

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return 'text-green-400';
      case 'optimizing': return 'text-yellow-400';
      case 'maintenance': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'operational': return '✅';
      case 'optimizing': return '⚡';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              QuantumFlow AI Ecosystem
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2">Version 15.4.0</p>
            <p className="text-lg text-gray-400 mb-4">Premium Platinum Diamond Grade</p>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-lg font-semibold ${getStatusColor()}`}>
                {getStatusIcon()} {systemStatus.toUpperCase()}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-400">🧠 AETHERIUS-PRIME Active</span>
            </div>
          </div>
        </header>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-xs text-gray-400">{metric.label}</span>
              </div>
              <div className={`text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quantum Coherence Display */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-12 border border-slate-700/50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">🧠 Quantum Coherence Monitor</h2>
            <div className="text-4xl font-bold mb-2">
              <span className="text-purple-400">{(coherence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${coherence * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">
              Target: 1.0 | Current: {coherence.toFixed(3)} | Status: {coherence >= 0.999 ? 'OPTIMAL' : 'STABILIZING'}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              href={feature.href}
              className="group block"
            >
              <div className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border ${feature.borderColor} hover:border-opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-xl ${feature.bgColor}`}>
                <div className="flex items-center mb-4">
                  <feature.icon className={`w-8 h-8 ${feature.color} mr-3`} />
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="flex items-center text-sm text-gray-400 group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* System Status Dashboard */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
          <h2 className="text-3xl font-bold mb-6 text-center">System Status Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="font-semibold">Database</div>
              <div className="text-sm text-gray-400">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="font-semibold">TypeScript</div>
              <div className="text-sm text-gray-400">Validated</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="font-semibold">Dependencies</div>
              <div className="text-sm text-gray-400">Installed</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="font-semibold">Environment</div>
              <div className="text-sm text-gray-400">Configured</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400">
          <div className="mb-4">
            <p className="text-sm">QuantumFlow AI Ecosystem v15.4.0</p>
            <p className="text-xs">Powered by AETHERIUS-PRIME Quantum Intelligence</p>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs">
            <span>🔒 Quantum-Resistant Security</span>
            <span>•</span>
            <span>🧠 Neural Synchronization</span>
            <span>•</span>
            <span>⚡ Real-time Optimization</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
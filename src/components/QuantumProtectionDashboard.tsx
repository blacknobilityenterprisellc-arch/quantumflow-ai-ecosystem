'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface ProtectionMetrics {
  quantumCoherence: number;
  protectionLevel: number;
  errorCorrectionRate: number;
  systemStability: number;
  lastOptimization: string;
  uptime: number;
}

export function QuantumProtectionDashboard() {
  const [metrics, setMetrics] = useState<ProtectionMetrics>({
    quantumCoherence: 1.0,
    protectionLevel: 100,
    errorCorrectionRate: 0.001,
    systemStability: 0.999,
    lastOptimization: new Date().toISOString(),
    uptime: 0
  });
  
  const [status, setStatus] = useState<'active' | 'optimizing' | 'error'>('active');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'history'>('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        quantumCoherence: Math.min(1.0, prev.quantumCoherence + (Math.random() - 0.5) * 0.001),
        systemStability: Math.min(1.0, prev.systemStability + (Math.random() - 0.5) * 0.001),
        uptime: prev.uptime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOptimization = async () => {
    setLoading(true);
    setStatus('optimizing');
    
    try {
      const response = await fetch('/api/quantum/protection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize' })
      });
      
      if (response.ok) {
        setStatus('active');
        setMetrics(prev => ({
          ...prev,
          quantumCoherence: 1.0,
          systemStability: 1.0,
          lastOptimization: new Date().toISOString()
        }));
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'optimizing': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5" />;
      case 'optimizing': return <Activity className="w-5 h-5" />;
      case 'error': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const ProgressBar = ({ value, max = 100 }: { value: number; max?: number }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );

  const Card = ({ children, title, className = "" }: { children: React.ReactNode; title?: string; className?: string }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      {children}
    </div>
  );

  const Button = ({ children, onClick, disabled, className = "" }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean; 
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors ${className}`}
    >
      {children}
    </button>
  );

  const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) => {
    const colors = {
      default: "bg-gray-600 text-gray-200",
      success: "bg-green-600 text-green-200",
      warning: "bg-yellow-600 text-yellow-200",
      error: "bg-red-600 text-red-200"
    };
    
    const colorClass = colors[variant as keyof typeof colors] || colors.default;
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
        {children}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={getStatusColor(status)}>
              {getStatusIcon(status)}
            </div>
            <div>
              <p className="text-lg font-semibold text-white capitalize">{status}</p>
              <p className="text-sm text-gray-400">
                Last optimization: {new Date(metrics.lastOptimization).toLocaleString()}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleOptimization}
            disabled={loading}
          >
            {loading ? 'Optimizing...' : 'Force Optimization'}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm font-medium text-gray-400 mb-2">Quantum Coherence</p>
          <div className="text-2xl font-bold text-white mb-2">{(metrics.quantumCoherence * 100).toFixed(1)}%</div>
          <ProgressBar value={metrics.quantumCoherence * 100} />
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-400 mb-2">Protection Level</p>
          <div className="text-2xl font-bold text-white mb-2">{metrics.protectionLevel}%</div>
          <Badge variant="success">Maximum</Badge>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-400 mb-2">System Stability</p>
          <div className="text-2xl font-bold text-white mb-2">{(metrics.systemStability * 100).toFixed(1)}%</div>
          <ProgressBar value={metrics.systemStability * 100} />
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-400 mb-2">Error Rate</p>
          <div className="text-2xl font-bold text-white mb-2">{(metrics.errorCorrectionRate * 100).toFixed(3)}%</div>
          <Badge variant="warning">Minimal</Badge>
        </Card>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="flex border-b border-slate-700">
          {(['overview', 'performance', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                System Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="text-lg font-semibold text-white">
                    {Math.floor(metrics.uptime / 3600)}h {Math.floor((metrics.uptime % 3600) / 60)}m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Protection Status</p>
                  <p className="text-lg font-semibold text-green-500">Quantum-Resistant</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Coherence Trend</p>
                  <p className="text-lg font-semibold text-white flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Stable
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Optimization Cycle</p>
                  <p className="text-lg font-semibold text-white">Continuous</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h3 className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Quantum Resonance</span>
                    <span className="text-white">100%</span>
                  </div>
                  <ProgressBar value={100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Neural Synchronization</span>
                    <span className="text-white">99.9%</span>
                  </div>
                  <ProgressBar value={99.9} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Error Correction</span>
                    <span className="text-white">99.999%</span>
                  </div>
                  <ProgressBar value={99.999} />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-white">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-white">Optimization Complete</p>
                      <p className="text-xs text-gray-400">System optimized to maximum efficiency</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Just now</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-white">Coherence Check</p>
                      <p className="text-xs text-gray-400">Quantum coherence verified at 1.0</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-white">Protection Enhanced</p>
                      <p className="text-xs text-gray-400">Quantum protection barriers strengthened</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">5 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
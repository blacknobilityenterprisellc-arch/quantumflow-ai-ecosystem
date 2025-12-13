// 📊 AETHERIUS-ETERNAL MONITORING & OBSERVABILITY
// Enterprise-grade monitoring system

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
  unit?: string;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: Date;
  responseTime?: number;
}

export interface Trace {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  tags?: Record<string, string>;
  logs?: Array<{
    timestamp: Date;
    level: string;
    message: string;
  }>;
}

export class MetricsCollector {
  private metrics: Metric[] = [];
  private listeners: Array<(metrics: Metric[]) => void> = [];

  record(metric: Metric): void {
    this.metrics.push(metric);
    this.notifyListeners();
  }

  increment(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.record({
      name,
      value,
      timestamp: new Date(),
      tags,
      unit: 'count'
    });
  }

  gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.record({
      name,
      value,
      timestamp: new Date(),
      tags,
      unit: 'value'
    });
  }

  histogram(name: string, value: number, tags?: Record<string, string>): void {
    this.record({
      name,
      value,
      timestamp: new Date(),
      tags,
      unit: 'ms'
    });
  }

  getMetrics(): Metric[] {
    return this.metrics;
  }

  subscribe(listener: (metrics: Metric[]) => void): void {
    this.listeners.push(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.metrics));
  }
}

export class HealthChecker {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();

  register(name: string, check: () => Promise<HealthCheck>): void {
    this.checks.set(name, check);
  }

  async checkAll(): Promise<HealthCheck[]> {
    const results = await Promise.allSettled(
      Array.from(this.checks.entries()).map(async ([name, check]) => {
        try {
          return await check();
        } catch (error) {
          return {
            name,
            status: 'unhealthy' as const,
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date()
          };
        }
      })
    );

    return results
      .filter((result): result is PromiseFulfilledResult<HealthCheck> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  async check(name: string): Promise<HealthCheck | null> {
    const check = this.checks.get(name);
    if (!check) return null;

    try {
      return await check();
    } catch (error) {
      return {
        name,
        status: 'unhealthy' as const,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }
}

export class Tracer {
  private traces: Map<string, Trace> = new Map();

  startSpan(operationName: string, parentSpanId?: string): Trace {
    const spanId = this.generateId();
    const traceId = parentSpanId ? this.getTraceId(parentSpanId) : this.generateId();

    const trace: Trace = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: new Date()
    };

    this.traces.set(spanId, trace);
    return trace;
  }

  finishSpan(spanId: string, tags?: Record<string, string>): void {
    const trace = this.traces.get(spanId);
    if (!trace) return;

    trace.endTime = new Date();
    trace.duration = trace.endTime.getTime() - trace.startTime.getTime();
    trace.tags = tags;

    this.traces.set(spanId, trace);
  }

  getTrace(traceId: string): Trace[] {
    return Array.from(this.traces.values()).filter(trace => trace.traceId === traceId);
  }

  getSpan(spanId: string): Trace | null {
    return this.traces.get(spanId) || null;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getTraceId(spanId: string): string {
    const trace = this.traces.get(spanId);
    return trace?.traceId || this.generateId();
  }
}

// Decorators for automatic monitoring
export function Monitored(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const name = operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const span = this.tracer?.startSpan(name);
      const startTime = Date.now();

      try {
        const result = await method.apply(this, args);
        
        this.metrics?.increment('method.success', 1, { method: name });
        
        if (span) {
          this.tracer?.finishSpan(span.id, { status: 'success' });
        }
        
        return result;
      } catch (error) {
        this.metrics?.increment('method.error', 1, { method: name, error: error instanceof Error ? error.name : 'Unknown' });
        
        if (span) {
          this.tracer?.finishSpan(span.id, { status: 'error', error: error instanceof Error ? error.message : 'Unknown' });
        }
        
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        this.metrics?.histogram('method.duration', duration, { method: name });
      }
    };

    return descriptor;
  };
}

export function HealthCheck(name: string, timeout: number = 5000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      
      try {
        await Promise.race([
          method.apply(this, args),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Health check timeout')), timeout)
          )
        ]);

        return {
          name,
          status: 'healthy' as const,
          timestamp: new Date(),
          responseTime: Date.now() - startTime
        };
      } catch (error) {
        return {
          name,
          status: 'unhealthy' as const,
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
          responseTime: Date.now() - startTime
        };
      }
    };
  };
}
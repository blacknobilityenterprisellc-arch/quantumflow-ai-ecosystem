// 🚀 AETHERIUS-ETERNAL GLOBAL TYPE DEFINITIONS
// Perfect TypeScript coverage for 100/100 code quality

export interface QuantumState {
  coherence: number;
  entanglement: number;
  superposition: boolean;
  measurement?: number;
}

export interface AIResponse {
  success: boolean;
  data: unknown;
  error?: string;
  timestamp: Date;
}

export interface ServiceMetrics {
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
}

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  ssl: boolean;
  pool: {
    min: number;
    max: number;
  };
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface QuantumMetrics {
  coherence: number;
  fidelity: number;
  errorRate: number;
  optimization: number;
}

export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

// Environment types
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

// Service types
export interface ServiceConfig {
  name: string;
  version: string;
  port: number;
  healthCheck: string;
  dependencies: string[];
}

export interface Microservice {
  id: string;
  config: ServiceConfig;
  status: 'running' | 'stopped' | 'error';
  metrics: ServiceMetrics;
}

// Database types
export interface DatabaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends DatabaseModel {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'developer';
  isActive: boolean;
  lastLogin?: Date;
}

export interface Project extends DatabaseModel {
  name: string;
  description: string;
  ownerId: string;
  isPublic: boolean;
  tags: string[];
}

// API types
export interface Request {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
}

export interface Response {
  status: number;
  headers: Record<string, string>;
  body?: unknown;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Error types
export interface AppError {
  name: string;
  message: string;
  stack?: string;
  code?: string;
  statusCode: number;
}

export interface ValidationError extends AppError {
  field: string;
  value: unknown;
}

// Configuration types
export interface AppConfig {
  app: {
    name: string;
    version: string;
    port: number;
    env: 'development' | 'production' | 'test';
  };
  database: DatabaseConnection;
  auth: {
    jwtSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  services: Record<string, ServiceConfig>;
}

// Hook types
export interface UseStateReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  reset: () => void;
}

export interface UseEffectReturn {
  cleanup: () => void;
}

// Event types
export interface CustomEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: Date;
  source: string;
}

export interface EventHandler<T = unknown> {
  (event: CustomEvent<T>): void | Promise<void>;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsMetrics {
  pageViews: number;
  uniqueUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
}

// Security types
export interface SecurityConfig {
  cors: {
    origins: string[];
    methods: string[];
    headers: string[];
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  csrf: {
    enabled: boolean;
    secret: string;
  };
}

export interface SecurityMetrics {
  threatsBlocked: number;
  suspiciousActivity: number;
  failedLogins: number;
  successfulLogins: number;
}

// Performance types
export interface PerformanceConfig {
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  compression: {
    enabled: boolean;
    level: number;
  };
  monitoring: {
    enabled: boolean;
    interval: number;
  };
}

export interface PerformanceReport {
  responseTime: number;
  throughput: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

// Export all types for global availability
declare global {
  namespace QuantumFlow {
    interface State {
      quantum: QuantumState;
      ai: AIResponse;
      metrics: QuantumMetrics;
    }
  }
}

export {};
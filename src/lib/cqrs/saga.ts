/**
 * Saga Pattern Implementation
 * Enterprise Architecture 2.0 - Quantum Enhanced
 * Distributed transaction management with compensation
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface SagaStep {
  id: string;
  name: string;
  action: SagaAction;
  compensation?: SagaCompensation;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface SagaAction {
  type: 'command' | 'service' | 'function';
  target: any;
  data: any;
  parameters?: any;
}

export interface SagaCompensation {
  type: 'command' | 'service' | 'function';
  target: any;
  data: any;
  parameters?: any;
}

export interface RetryPolicy {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

export interface SagaDefinition {
  id: string;
  name: string;
  description?: string;
  steps: SagaStep[];
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface SagaInstance {
  id: string;
  definitionId: string;
  status: SagaStatus;
  currentStep: number;
  completedSteps: number[];
  failedSteps: number[];
  compensationSteps: number[];
  data: any;
  error?: Error;
  startTime: Date;
  endTime?: Date;
  metadata: Record<string, any>;
}

export enum SagaStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
  ABORTED = 'ABORTED'
}

export interface ISagaRepository {
  save(saga: SagaInstance): Promise<void>;
  findById(id: string): Promise<SagaInstance | null>;
  findByStatus(status: SagaStatus): Promise<SagaInstance[]>;
  findByDefinition(definitionId: string): Promise<SagaInstance[]>;
  delete(id: string): Promise<void>;
}

// In-memory Saga Repository
export class InMemorySagaRepository implements ISagaRepository {
  private sagas: Map<string, SagaInstance> = new Map();

  async save(saga: SagaInstance): Promise<void> {
    this.sagas.set(saga.id, saga);
  }

  async findById(id: string): Promise<SagaInstance | null> {
    return this.sagas.get(id) || null;
  }

  async findByStatus(status: SagaStatus): Promise<SagaInstance[]> {
    return Array.from(this.sagas.values()).filter(saga => saga.status === status);
  }

  async findByDefinition(definitionId: string): Promise<SagaInstance[]> {
    return Array.from(this.sagas.values()).filter(saga => saga.definitionId === definitionId);
  }

  async delete(id: string): Promise<void> {
    this.sagas.delete(id);
  }
}

// Action Executor
export interface ActionExecutor {
  execute(action: SagaAction): Promise<any>;
  executeCompensation(compensation: SagaCompensation): Promise<any>;
}

// Default Action Executor
export class DefaultActionExecutor implements ActionExecutor {
  async execute(action: SagaAction): Promise<any> {
    switch (action.type) {
      case 'function':
        if (typeof action.target === 'function') {
          return (action.target as Function)(action.data);
        }
        throw new Error('Invalid function target');
      
      case 'service':
        // This would make an HTTP call or service invocation
        throw new Error('Service execution not implemented');
      
      case 'command':
        // This would dispatch a command through CQRS
        throw new Error('Command execution not implemented');
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  async executeCompensation(compensation: SagaCompensation): Promise<any> {
    // Similar to execute but for compensation actions
    switch (compensation.type) {
      case 'function':
        if (typeof compensation.target === 'function') {
          return (compensation.target as Function)(compensation.data);
        }
        throw new Error('Invalid compensation function target');
      
      case 'service':
        throw new Error('Service compensation not implemented');
      
      case 'command':
        throw new Error('Command compensation not implemented');
      
      default:
        throw new Error(`Unknown compensation type: ${compensation.type}`);
    }
  }
}

// Saga Engine
export class SagaEngine extends EventEmitter {
  constructor(
    private repository: ISagaRepository,
    private executor: ActionExecutor = new DefaultActionExecutor()
  ) {
    super();
  }

  // Start a new saga instance
  async startSaga(definition: SagaDefinition, data?: any): Promise<SagaInstance> {
    const saga: SagaInstance = {
      id: uuidv4(),
      definitionId: definition.id,
      status: SagaStatus.PENDING,
      currentStep: 0,
      completedSteps: [],
      failedSteps: [],
      compensationSteps: [],
      data: data || {},
      startTime: new Date(),
      metadata: {}
    };

    await this.repository.save(saga);
    this.emit('sagaStarted', { saga, definition });

    // Start executing the saga
    this.executeSaga(saga, definition).catch(error => {
      this.emit('sagaError', { saga, error });
    });

    return saga;
  }

  // Execute saga steps
  private async executeSaga(saga: SagaInstance, definition: SagaDefinition): Promise<void> {
    try {
      saga.status = SagaStatus.RUNNING;
      await this.repository.save(saga);

      for (let i = 0; i < definition.steps.length; i++) {
        saga.currentStep = i;
        await this.repository.save(saga);

        const step = definition.steps[i];
        
        try {
          await this.executeStep(saga, step, definition);
          saga.completedSteps.push(i);
          await this.repository.save(saga);
          
          this.emit('stepCompleted', { saga, step, stepIndex: i });
        } catch (error) {
          saga.failedSteps.push(i);
          saga.error = error as Error;
          await this.repository.save(saga);
          
          this.emit('stepFailed', { saga, step, stepIndex: i, error });
          
          // Start compensation
          await this.compensate(saga, definition);
          return;
        }
      }

      // Saga completed successfully
      saga.status = SagaStatus.COMPLETED;
      saga.endTime = new Date();
      await this.repository.save(saga);
      
      this.emit('sagaCompleted', { saga, definition });
    } catch (error) {
      saga.status = SagaStatus.FAILED;
      saga.error = error as Error;
      saga.endTime = new Date();
      await this.repository.save(saga);
      
      this.emit('sagaFailed', { saga, definition, error });
    }
  }

  // Execute individual step with retry logic
  private async executeStep(
    saga: SagaInstance, 
    step: SagaStep, 
    definition: SagaDefinition
  ): Promise<any> {
    const retryPolicy = step.retryPolicy || definition.retryPolicy || {
      maxAttempts: 3,
      delay: 1000,
      backoffMultiplier: 2,
      maxDelay: 10000
    };

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt++) {
      try {
        const timeout = step.timeout || definition.timeout || 30000;
        
        // Execute with timeout
        const result = await this.executeWithTimeout(
          () => this.executor.execute(step.action),
          timeout
        );
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryPolicy.maxAttempts) {
          const delay = Math.min(
            retryPolicy.delay * Math.pow(retryPolicy.backoffMultiplier || 2, attempt - 1),
            retryPolicy.maxDelay || 30000
          );
          
          await this.sleep(delay);
          this.emit('stepRetry', { saga, step, attempt, error });
        }
      }
    }
    
    throw lastError;
  }

  // Compensate completed steps
  private async compensate(saga: SagaInstance, definition: SagaDefinition): Promise<void> {
    saga.status = SagaStatus.COMPENSATING;
    await this.repository.save(saga);
    
    this.emit('compensationStarted', { saga, definition });

    // Compensate in reverse order
    for (let i = saga.completedSteps.length - 1; i >= 0; i--) {
      const stepIndex = saga.completedSteps[i];
      const step = definition.steps[stepIndex];
      
      if (step.compensation) {
        try {
          await this.executor.executeCompensation(step.compensation);
          saga.compensationSteps.push(stepIndex);
          await this.repository.save(saga);
          
          this.emit('compensationStepCompleted', { saga, step, stepIndex });
        } catch (error) {
          this.emit('compensationStepFailed', { saga, step, stepIndex, error });
          // Continue with compensation even if one step fails
        }
      }
    }

    saga.status = SagaStatus.COMPENSATED;
    saga.endTime = new Date();
    await this.repository.save(saga);
    
    this.emit('compensationCompleted', { saga, definition });
  }

  // Execute function with timeout
  private async executeWithTimeout<T>(
    fn: () => Promise<T>, 
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  }

  // Sleep utility
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get saga status
  async getSagaStatus(sagaId: string): Promise<SagaStatus | null> {
    const saga = await this.repository.findById(sagaId);
    return saga ? saga.status : null;
  }

  // Abort saga
  async abortSaga(sagaId: string): Promise<void> {
    const saga = await this.repository.findById(sagaId);
    if (!saga) {
      throw new Error(`Saga not found: ${sagaId}`);
    }

    if (saga.status === SagaStatus.RUNNING) {
      saga.status = SagaStatus.ABORTED;
      saga.endTime = new Date();
      await this.repository.save(saga);
      
      this.emit('sagaAborted', { saga });
    }
  }

  // Retry failed saga
  async retrySaga(sagaId: string, definition: SagaDefinition): Promise<void> {
    const saga = await this.repository.findById(sagaId);
    if (!saga) {
      throw new Error(`Saga not found: ${sagaId}`);
    }

    if (saga.status === SagaStatus.FAILED) {
      // Reset saga state and retry
      saga.status = SagaStatus.PENDING;
      saga.currentStep = 0;
      saga.failedSteps = [];
      saga.error = undefined;
      saga.startTime = new Date();
      saga.endTime = undefined;
      
      await this.repository.save(saga);
      
      // Restart execution
      this.executeSaga(saga, definition).catch(error => {
        this.emit('sagaError', { saga, error });
      });
    }
  }
}

// Saga Builder for fluent API
export class SagaBuilder {
  private steps: SagaStep[] = [];
  private timeout?: number;
  private retryPolicy?: RetryPolicy;

  static create(name: string): SagaDefinitionBuilder {
    return new SagaDefinitionBuilder(name);
  }

  addStep(step: SagaStep): SagaBuilder {
    this.steps.push(step);
    return this;
  }

  withTimeout(timeout: number): SagaBuilder {
    this.timeout = timeout;
    return this;
  }

  withRetryPolicy(policy: RetryPolicy): SagaBuilder {
    this.retryPolicy = policy;
    return this;
  }

  build(): Omit<SagaDefinition, 'id' | 'name' | 'description'> {
    return {
      steps: this.steps,
      timeout: this.timeout,
      retryPolicy: this.retryPolicy
    };
  }
}

export class SagaDefinitionBuilder {
  constructor(private name: string) {}

  private description?: string;
  private builder = new SagaBuilder();

  withDescription(description: string): SagaDefinitionBuilder {
    this.description = description;
    return this;
  }

  step(name: string): SagaStepBuilder {
    return new SagaStepBuilder(name, this);
  }

  build(id: string): SagaDefinition {
    return {
      id,
      name: this.name,
      description: this.description,
      ...this.builder.build()
    };
  }
}

export class SagaStepBuilder {
  private step: SagaStep;

  constructor(name: string, private sagaBuilder: SagaDefinitionBuilder) {
    this.step = {
      id: uuidv4(),
      name,
      action: { type: 'function', target: '', data: {} }
    };
  }

  invoke(func: any, data?: any): SagaStepBuilder {
    this.step.action = { type: 'function', target: func, data: data || {} };
    return this;
  }

  compensate(func: any, data?: any): SagaStepBuilder {
    this.step.compensation = { type: 'function', target: func, data: data || {} };
    return this;
  }

  withTimeout(timeout: number): SagaStepBuilder {
    this.step.timeout = timeout;
    return this;
  }

  withRetryPolicy(policy: RetryPolicy): SagaStepBuilder {
    this.step.retryPolicy = policy;
    return this;
  }

  then(): SagaDefinitionBuilder {
    this.sagaBuilder['builder'].addStep(this.step);
    return this.sagaBuilder;
  }

  build(): SagaDefinitionBuilder {
    return this.then();
  }
}
/**
 * CQRS (Command Query Responsibility Segregation) Implementation
 * Enterprise Architecture 2.0 - Quantum Enhanced
 * 
 * Separates read and write operations for optimal performance and scalability
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

// Base types for CQRS pattern
export interface Command {
  id: string;
  type: string;
  aggregateId: string;
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface Query {
  id: string;
  type: string;
  parameters: any;
  timestamp: Date;
}

export interface Event {
  id: string;
  aggregateId: string;
  type: string;
  data: any;
  version: number;
  timestamp: Date;
}

export interface CommandHandler<T extends Command> {
  canHandle(command: T): boolean;
  handle(command: T): Promise<Event[]>;
}

export interface QueryHandler<T extends Query, R> {
  canHandle(query: T): boolean;
  handle(query: T): Promise<R>;
}

export interface EventHandler<T extends Event> {
  canHandle(event: T): boolean;
  handle(event: T): Promise<void>;
}

export interface Aggregate {
  id: string;
  version: number;
  apply(event: Event): void;
  getUncommittedEvents(): Event[];
  markEventsAsCommitted(): void;
}

// Base Aggregate implementation
export abstract class BaseAggregate implements Aggregate {
  public readonly id: string;
  public version: number = 0;
  private uncommittedEvents: Event[] = [];

  constructor(id: string) {
    this.id = id;
  }

  protected applyEvent(event: Event): void {
    this.version++;
    this.uncommittedEvents.push(event);
  }

  public apply(event: Event): void {
    this.version++;
    // Apply event logic to be implemented by concrete aggregates
  }

  public getUncommittedEvents(): Event[] {
    return [...this.uncommittedEvents];
  }

  public markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  public loadFromHistory(events: Event[]): void {
    for (const event of events) {
      this.apply(event);
      this.version = event.version;
    }
  }
}

// Command Bus Implementation
export class CommandBus extends EventEmitter {
  private handlers: Map<string, CommandHandler<any>[]> = new Map();

  public register<T extends Command>(commandType: string, handler: CommandHandler<T>): void {
    if (!this.handlers.has(commandType)) {
      this.handlers.set(commandType, []);
    }
    this.handlers.get(commandType)!.push(handler);
  }

  public async dispatch(command: Command): Promise<Event[]> {
    const handlers = this.handlers.get(command.type);
    if (!handlers || handlers.length === 0) {
      throw new Error(`No handler registered for command type: ${command.type}`);
    }

    const handler = handlers.find(h => h.canHandle(command));
    if (!handler) {
      throw new Error(`No suitable handler found for command: ${command.type}`);
    }

    try {
      const events = await handler.handle(command);
      this.emit('commandExecuted', { command, events });
      return events;
    } catch (error) {
      this.emit('commandFailed', { command, error });
      throw error;
    }
  }
}

// Query Bus Implementation
export class QueryBus extends EventEmitter {
  private handlers: Map<string, QueryHandler<any, any>[]> = new Map();

  public register<T extends Query, R>(queryType: string, handler: QueryHandler<T, R>): void {
    if (!this.handlers.has(queryType)) {
      this.handlers.set(queryType, []);
    }
    this.handlers.get(queryType)!.push(handler);
  }

  public async execute<T extends Query, R>(query: T): Promise<R> {
    const handlers = this.handlers.get(query.type);
    if (!handlers || handlers.length === 0) {
      throw new Error(`No handler registered for query type: ${query.type}`);
    }

    const handler = handlers.find(h => h.canHandle(query));
    if (!handler) {
      throw new Error(`No suitable handler found for query: ${query.type}`);
    }

    try {
      const result = await handler.handle(query);
      this.emit('queryExecuted', { query, result });
      return result;
    } catch (error) {
      this.emit('queryFailed', { query, error });
      throw error;
    }
  }
}

// Event Bus Implementation
export class EventBus extends EventEmitter {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  public register<T extends Event>(eventType: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  public async publish(events: Event[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.type);
      if (handlers) {
        await Promise.all(
          handlers
            .filter(h => h.canHandle(event))
            .map(h => h.handle(event))
        );
      }
      this.emit('eventPublished', event);
    }
  }
}

// CQRS Engine - Orchestrates all components
export class CQRSEngine {
  private commandBus: CommandBus;
  private queryBus: QueryBus;
  private eventBus: EventBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.queryBus = new QueryBus();
    this.eventBus = new EventBus();
  }

  // Registration methods
  public registerCommandHandler<T extends Command>(commandType: string, handler: CommandHandler<T>): void {
    this.commandBus.register(commandType, handler);
  }

  public registerQueryHandler<T extends Query, R>(queryType: string, handler: QueryHandler<T, R>): void {
    this.queryBus.register(queryType, handler);
  }

  public registerEventHandler<T extends Event>(eventType: string, handler: EventHandler<T>): void {
    this.eventBus.register(eventType, handler);
  }

  // Execution methods
  public async executeCommand(command: Command): Promise<Event[]> {
    const events = await this.commandBus.dispatch(command);
    await this.eventBus.publish(events);
    return events;
  }

  public async executeQuery<T extends Query, R>(query: T): Promise<R> {
    return this.queryBus.execute(query);
  }

  // Access to buses for advanced usage
  get commandBusInstance(): CommandBus { return this.commandBus; }
  get queryBusInstance(): QueryBus { return this.queryBus; }
  get eventBusInstance(): EventBus { return this.eventBus; }
}

// Factory functions
export function createCommand(type: string, aggregateId: string, data: any, userId?: string): Command {
  return {
    id: uuidv4(),
    type,
    aggregateId,
    data,
    timestamp: new Date(),
    userId
  };
}

export function createQuery(type: string, parameters: any): Query {
  return {
    id: uuidv4(),
    type,
    parameters,
    timestamp: new Date()
  };
}

export function createEvent(type: string, aggregateId: string, data: any, version: number): Event {
  return {
    id: uuidv4(),
    aggregateId,
    type,
    data,
    version,
    timestamp: new Date()
  };
}
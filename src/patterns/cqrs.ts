// 🎯 AETHERIUS-ETERNAL CQRS PATTERN
// Command Query Responsibility Segregation

export interface Command<T = unknown> {
  id: string;
  type: string;
  data: T;
  timestamp: Date;
  userId?: string;
}

export interface Query<T = unknown> {
  id: string;
  type: string;
  parameters: T;
  timestamp: Date;
}

export interface Event<T = unknown> {
  id: string;
  type: string;
  data: T;
  timestamp: Date;
  aggregateId: string;
  version: number;
}

export class CommandBus {
  private handlers = new Map<string, Function>();

  register<T>(commandType: string, handler: (command: Command<T>) => Promise<void>) {
    this.handlers.set(commandType, handler);
  }

  async dispatch<T>(command: Command<T>): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`);
    }
    await handler(command);
  }
}

export class QueryBus {
  private handlers = new Map<string, Function>();

  register<T, R>(queryType: string, handler: (query: Query<T>) => Promise<R>) {
    this.handlers.set(queryType, handler);
  }

  async execute<T, R>(query: Query<T>): Promise<R> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for query: ${query.type}`);
    }
    return await handler(query);
  }
}

export class EventBus {
  private handlers = new Map<string, Function[]>();
  private events: Event[] = [];

  subscribe<T>(eventType: string, handler: (event: Event<T>) => Promise<void>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish<T>(event: Event<T>): Promise<void> {
    this.events.push(event);
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(handler => handler(event)));
  }

  getEvents(): Event[] {
    return this.events;
  }
}

// Event Sourcing
export class EventStore {
  private events: Map<string, Event[]> = new Map();

  saveEvents(aggregateId: string, events: Event[]): void {
    const existingEvents = this.events.get(aggregateId) || [];
    this.events.set(aggregateId, [...existingEvents, ...events]);
  }

  getEvents(aggregateId: string): Event[] {
    return this.events.get(aggregateId) || [];
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values()).flat();
  }
}

// Aggregate Root
export abstract class AggregateRoot {
  private _id: string;
  private _version: number = 0;
  private _changes: Event[] = [];

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  get version(): number {
    return this._version;
  }

  get changes(): Event[] {
    return this._changes;
  }

  protected apply<T>(event: Event<T>): void {
    event.aggregateId = this._id;
    event.version = this._version + 1;
    this._changes.push(event);
    this._version++;
  }

  markChangesAsCommitted(): void {
    this._changes = [];
  }
}
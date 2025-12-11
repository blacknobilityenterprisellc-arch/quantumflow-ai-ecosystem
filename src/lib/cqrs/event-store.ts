/**
 * Event Store Implementation for CQRS
 * Enterprise Architecture 2.0 - Quantum Enhanced
 */

import { Event } from './index';

// Re-export Event for other modules that need it
export { Event } from './index';

export interface EventDescriptor {
  event: Event;
  metadata: {
    causationId?: string;
    correlationId?: string;
    userId?: string;
    [key: string]: any;
  };
}

export interface Snapshot {
  aggregateId: string;
  data: any;
  version: number;
  timestamp: Date;
}

export interface IEventStore {
  saveEvents(aggregateId: string, events: Event[], expectedVersion: number): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<Event[]>;
  getSnapshot(aggregateId: string): Promise<Snapshot | null>;
  saveSnapshot(snapshot: Snapshot): Promise<void>;
  getEventsByType(eventType: string, fromTimestamp?: Date): Promise<Event[]>;
}

// In-memory Event Store for development
export class InMemoryEventStore implements IEventStore {
  private events: Map<string, Event[]> = new Map();
  private snapshots: Map<string, Snapshot> = new Map();

  async saveEvents(aggregateId: string, events: Event[], expectedVersion: number): Promise<void> {
    const existingEvents = this.events.get(aggregateId) || [];
    
    if (existingEvents.length > 0 && existingEvents[existingEvents.length - 1].version !== expectedVersion) {
      throw new Error(`Concurrency conflict detected for aggregate ${aggregateId}`);
    }

    const updatedEvents = [...existingEvents, ...events];
    this.events.set(aggregateId, updatedEvents);
  }

  async getEvents(aggregateId: string, fromVersion?: number): Promise<Event[]> {
    const events = this.events.get(aggregateId) || [];
    
    if (fromVersion) {
      return events.filter(e => e.version > fromVersion);
    }
    
    return events;
  }

  async getSnapshot(aggregateId: string): Promise<Snapshot | null> {
    return this.snapshots.get(aggregateId) || null;
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    this.snapshots.set(snapshot.aggregateId, snapshot);
  }

  async getEventsByType(eventType: string, fromTimestamp?: Date): Promise<Event[]> {
    const allEvents: Event[] = [];
    
    for (const events of this.events.values()) {
      for (const event of events) {
        if (event.type === eventType) {
          if (!fromTimestamp || event.timestamp >= fromTimestamp) {
            allEvents.push(event);
          }
        }
      }
    }
    
    return allEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

// Database-backed Event Store
export class DatabaseEventStore implements IEventStore {
  constructor(private db: any) {}

  async saveEvents(aggregateId: string, events: Event[], expectedVersion: number): Promise<void> {
    // Implementation would use Prisma or similar ORM
    // This is a placeholder for the actual database implementation
    throw new Error('DatabaseEventStore not implemented yet');
  }

  async getEvents(aggregateId: string, fromVersion?: number): Promise<Event[]> {
    // Implementation would query database for events
    throw new Error('DatabaseEventStore not implemented yet');
  }

  async getSnapshot(aggregateId: string): Promise<Snapshot | null> {
    // Implementation would query database for snapshot
    throw new Error('DatabaseEventStore not implemented yet');
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    // Implementation would save snapshot to database
    throw new Error('DatabaseEventStore not implemented yet');
  }

  async getEventsByType(eventType: string, fromTimestamp?: Date): Promise<Event[]> {
    // Implementation would query database for events by type
    throw new Error('DatabaseEventStore not implemented yet');
  }
}

// Event Store Factory
export class EventStoreFactory {
  static create(type: 'memory' | 'database', db?: any): IEventStore {
    switch (type) {
      case 'memory':
        return new InMemoryEventStore();
      case 'database':
        if (!db) {
          throw new Error('Database connection required for database event store');
        }
        return new DatabaseEventStore(db);
      default:
        throw new Error(`Unknown event store type: ${type}`);
    }
  }
}
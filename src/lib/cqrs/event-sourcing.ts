/**
 * Event Sourcing Implementation
 * Enterprise Architecture 2.0 - Quantum Enhanced
 * Complete audit trail with temporal querying capabilities
 */

import { Event, IEventStore, Snapshot } from './event-store';
import { BaseAggregate } from './index';
import { EventEmitter } from 'events';

export interface EventStream {
  aggregateId: string;
  events: Event[];
  version: number;
  timestamp: Date;
}

export interface EventFilter {
  aggregateIds?: string[];
  eventTypes?: string[];
  fromTimestamp?: Date;
  toTimestamp?: Date;
  fromVersion?: number;
  toVersion?: number;
}

export interface Projection {
  name: string;
  lastProcessedEventId?: string;
  lastProcessedVersion: number;
  data: any;
}

export interface IProjectionHandler<T = any> {
  name: string;
  handle(event: Event): Promise<T>;
  canHandle(event: Event): boolean;
}

// Event Sourcing Engine
export class EventSourcingEngine extends EventEmitter {
  constructor(
    private eventStore: IEventStore,
    private snapshotFrequency: number = 100
  ) {
    super();
  }

  // Save events for an aggregate
  async saveEvents(aggregateId: string, events: Event[], expectedVersion: number): Promise<void> {
    await this.eventStore.saveEvents(aggregateId, events, expectedVersion);
    
    // Check if snapshot should be created
    const totalEvents = await this.getEventCount(aggregateId);
    if (totalEvents % this.snapshotFrequency === 0) {
      await this.createSnapshot(aggregateId);
    }

    this.emit('eventsSaved', { aggregateId, events });
  }

  // Load aggregate from event history
  async loadAggregate<T extends BaseAggregate>(
    aggregateClass: new (id: string) => T,
    aggregateId: string
  ): Promise<T> {
    // Try to load from snapshot first
    const snapshot = await this.eventStore.getSnapshot(aggregateId);
    const aggregate = new aggregateClass(aggregateId);

    if (snapshot) {
      // Load snapshot data into aggregate
      Object.assign(aggregate, snapshot.data);
      aggregate.version = snapshot.version;
    }

    // Load remaining events
    const fromVersion = snapshot ? snapshot.version : 0;
    const events = await this.eventStore.getEvents(aggregateId, fromVersion);

    for (const event of events) {
      aggregate.apply(event);
    }

    return aggregate;
  }

  // Get event stream for an aggregate
  async getEventStream(aggregateId: string, fromVersion?: number): Promise<EventStream> {
    const events = await this.eventStore.getEvents(aggregateId, fromVersion);
    const version = events.length > 0 ? events[events.length - 1].version : 0;
    const timestamp = events.length > 0 ? events[events.length - 1].timestamp : new Date();

    return {
      aggregateId,
      events,
      version,
      timestamp
    };
  }

  // Query events with filters
  async queryEvents(filter: EventFilter): Promise<Event[]> {
    const allEvents: Event[] = [];

    if (filter.eventTypes && filter.eventTypes.length === 1) {
      // Use optimized query for single event type
      const events = await this.eventStore.getEventsByType(
        filter.eventTypes[0],
        filter.fromTimestamp
      );
      allEvents.push(...events);
    } else {
      // For complex queries, we'd need to implement a more sophisticated query system
      // This is a simplified implementation
      throw new Error('Complex event queries not yet implemented');
    }

    // Apply filters
    let filteredEvents = allEvents;

    if (filter.aggregateIds) {
      filteredEvents = filteredEvents.filter(e => filter.aggregateIds!.includes(e.aggregateId));
    }

    if (filter.eventTypes && filter.eventTypes.length > 1) {
      filteredEvents = filteredEvents.filter(e => filter.eventTypes!.includes(e.type));
    }

    if (filter.toTimestamp) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filter.toTimestamp!);
    }

    if (filter.fromVersion) {
      filteredEvents = filteredEvents.filter(e => e.version >= filter.fromVersion!);
    }

    if (filter.toVersion) {
      filteredEvents = filteredEvents.filter(e => e.version <= filter.toVersion!);
    }

    return filteredEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Create snapshot for an aggregate
  async createSnapshot(aggregateId: string): Promise<void> {
    const events = await this.eventStore.getEvents(aggregateId);
    if (events.length === 0) return;

    const latestEvent = events[events.length - 1];
    
    // Create snapshot data (this would be aggregate-specific)
    const snapshotData = await this.createSnapshotData(aggregateId, events);

    const snapshot: Snapshot = {
      aggregateId,
      data: snapshotData,
      version: latestEvent.version,
      timestamp: latestEvent.timestamp
    };

    await this.eventStore.saveSnapshot(snapshot);
    this.emit('snapshotCreated', { aggregateId, snapshot });
  }

  // Create snapshot data (to be overridden by specific implementations)
  protected async createSnapshotData(aggregateId: string, events: Event[]): Promise<any> {
    // Default implementation - just return the latest event data
    const latestEvent = events[events.length - 1];
    return latestEvent.data;
  }

  // Get event count for an aggregate
  private async getEventCount(aggregateId: string): Promise<number> {
    const events = await this.eventStore.getEvents(aggregateId);
    return events.length;
  }

  // Replay events for an aggregate
  async replayEvents(aggregateId: string, fromVersion?: number): Promise<Event[]> {
    return this.eventStore.getEvents(aggregateId, fromVersion);
  }

  // Get aggregate version
  async getAggregateVersion(aggregateId: string): Promise<number> {
    const events = await this.eventStore.getEvents(aggregateId);
    return events.length > 0 ? events[events.length - 1].version : 0;
  }

  // Check if aggregate exists
  async aggregateExists(aggregateId: string): Promise<boolean> {
    const events = await this.eventStore.getEvents(aggregateId);
    return events.length > 0;
  }
}

// Projection Manager for Read Models
export class ProjectionManager extends EventEmitter {
  private projections: Map<string, Projection> = new Map();
  private handlers: IProjectionHandler[] = [];

  constructor(private eventSourcingEngine: EventSourcingEngine) {
    super();
  }

  // Register projection handler
  registerProjection<T>(handler: IProjectionHandler<T>): void {
    this.handlers.push(handler);
    
    // Initialize projection if it doesn't exist
    if (!this.projections.has(handler.name)) {
      this.projections.set(handler.name, {
        name: handler.name,
        lastProcessedVersion: 0,
        data: null
      });
    }
  }

  // Update projections with new events
  async updateProjections(events: Event[]): Promise<void> {
    for (const event of events) {
      for (const handler of this.handlers) {
        if (handler.canHandle(event)) {
          const projection = this.projections.get(handler.name)!;
          
          try {
            const newData = await handler.handle(event);
            
            this.projections.set(handler.name, {
              name: handler.name,
              lastProcessedEventId: event.id,
              lastProcessedVersion: event.version,
              data: newData
            });

            this.emit('projectionUpdated', {
              projectionName: handler.name,
              event,
              data: newData
            });
          } catch (error) {
            this.emit('projectionError', {
              projectionName: handler.name,
              event,
              error
            });
          }
        }
      }
    }
  }

  // Get projection data
  getProjection<T>(name: string): T | null {
    const projection = this.projections.get(name);
    return projection ? projection.data : null;
  }

  // Get all projections
  getAllProjections(): Map<string, Projection> {
    return new Map(this.projections);
  }

  // Rebuild projection from scratch
  async rebuildProjection(projectionName: string, filter?: EventFilter): Promise<void> {
    const handler = this.handlers.find(h => h.name === projectionName);
    if (!handler) {
      throw new Error(`No handler found for projection: ${projectionName}`);
    }

    // Reset projection
    this.projections.set(projectionName, {
      name: projectionName,
      lastProcessedVersion: 0,
      data: null
    });

    // Get all relevant events
    const events = filter ? 
      await this.eventSourcingEngine.queryEvents(filter) : 
      await this.eventSourcingEngine.queryEvents({});

    // Rebuild projection
    await this.updateProjections(events);
    
    this.emit('projectionRebuilt', { projectionName });
  }
}

// Audit Trail Manager
export class AuditTrailManager {
  constructor(private eventSourcingEngine: EventSourcingEngine) {}

  // Get complete audit trail for aggregate
  async getAuditTrail(aggregateId: string): Promise<EventStream> {
    return this.eventSourcingEngine.getEventStream(aggregateId);
  }

  // Get user activity
  async getUserActivity(userId: string, fromTimestamp?: Date): Promise<Event[]> {
    // This would require events to have userId metadata
    // Implementation would query events by userId
    throw new Error('User activity tracking not yet implemented');
  }

  // Get system activity
  async getSystemActivity(filter: EventFilter): Promise<Event[]> {
    return this.eventSourcingEngine.queryEvents(filter);
  }

  // Generate audit report
  async generateAuditReport(filter: EventFilter): Promise<{
    totalEvents: number;
    eventTypes: Record<string, number>;
    aggregates: Record<string, number>;
    timeRange: { start: Date; end: Date };
  }> {
    const events = await this.eventSourcingEngine.queryEvents(filter);
    
    const eventTypes: Record<string, number> = {};
    const aggregates: Record<string, number> = {};
    
    for (const event of events) {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
      aggregates[event.aggregateId] = (aggregates[event.aggregateId] || 0) + 1;
    }

    const timestamps = events.map(e => e.timestamp);
    const start = timestamps.length > 0 ? Math.min(...timestamps.map(t => t.getTime())) : Date.now();
    const end = timestamps.length > 0 ? Math.max(...timestamps.map(t => t.getTime())) : Date.now();

    return {
      totalEvents: events.length,
      eventTypes,
      aggregates,
      timeRange: {
        start: new Date(start),
        end: new Date(end)
      }
    };
  }
}
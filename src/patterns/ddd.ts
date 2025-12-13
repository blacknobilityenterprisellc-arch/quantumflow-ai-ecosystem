// 🏗️ AETHERIUS-ETERNAL DOMAIN-DRIVEN DESIGN
// Perfect DDD Implementation

export interface ValueObject {
  equals(other: ValueObject): boolean;
}

export interface Entity {
  id: string;
  equals(other: Entity): boolean;
}

export interface AggregateRoot extends Entity {
  getChanges(): DomainEvent[];
  markChangesAsCommitted(): void;
}

export interface Repository<T extends AggregateRoot> {
  save(aggregate: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
}

export interface DomainEvent {
  aggregateId: string;
  occurredOn: Date;
  eventData: unknown;
}

export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export abstract class ValueObjectBase implements ValueObject {
  equals(other: ValueObject): boolean {
    if (this === other) return true;
    if (typeof other !== 'object' || other === null) return false;
    
    return JSON.stringify(this) === JSON.stringify(other);
  }
}

export abstract class EntityBase implements Entity {
  constructor(public readonly id: string) {}

  equals(other: Entity): boolean {
    if (this === other) return true;
    if (typeof other !== 'object' || other === null) return false;
    
    return this.id === other.id;
  }
}

export abstract class AggregateRootBase extends EntityBase implements AggregateRoot {
  private _changes: DomainEvent[] = [];
  private _version: number = 0;

  get version(): number {
    return this._version;
  }

  getChanges(): DomainEvent[] {
    return [...this._changes];
  }

  markChangesAsCommitted(): void {
    this._changes = [];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._changes.push(event);
    this._version++;
  }
}

export abstract class RepositoryBase<T extends AggregateRoot> implements Repository<T> {
  constructor(private _aggregates: Map<string, T> = new Map()) {}

  async save(aggregate: T): Promise<void> {
    this._aggregates.set(aggregate.id, aggregate);
    aggregate.markChangesAsCommitted();
  }

  async findById(id: string): Promise<T | null> {
    return this._aggregates.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this._aggregates.values());
  }

  async delete(id: string): Promise<void> {
    this._aggregates.delete(id);
  }
}

export class AndSpecification<T> implements Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

export class OrSpecification<T> implements Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

export class NotSpecification<T> implements Specification<T> {
  constructor(private spec: Specification<T>) {}

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}
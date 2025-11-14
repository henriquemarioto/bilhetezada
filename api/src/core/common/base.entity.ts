export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity implements IBaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id?: string, createdAt?: Date) {
    this.id = id || this.generateId();
    this.createdAt = createdAt || new Date();
    this.updatedAt = new Date();
  }

  protected abstract generateId(): string;

  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

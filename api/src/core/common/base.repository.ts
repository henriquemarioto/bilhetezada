export interface FindOptions<T> {
  where?: Partial<T>;
  select?: (keyof T)[];
  relations?: string[];
  order?: { [P in keyof T]?: 'ASC' | 'DESC' };
  take?: number;
  skip?: number;
}

export interface FindOneOptions<T> {
  where?: Partial<T>;
  select?: (keyof T)[];
  relations?: string[];
}

export interface UpdateResult {
  affected?: number;
  raw?: any;
}

export interface DeleteResult {
  affected?: number;
  raw?: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface IBaseRepository<T> {
  findAll(options?: FindOptions<T>): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
  exists(where: Partial<T>): Promise<boolean>;
  count(where?: Partial<T>): Promise<number>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  deleteMany(where: Partial<T>): Promise<number>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected abstract findAllImplementation(
    options?: FindOptions<T>,
  ): Promise<T[]>;
  protected abstract findOneImplementation(
    options: FindOneOptions<T>,
  ): Promise<T | null>;
  protected abstract createImplementation(data: Partial<T>): Promise<T>;
  protected abstract updateImplementation(
    id: string | number,
    data: Partial<T>,
  ): Promise<UpdateResult>;
  protected abstract deleteImplementation(
    id: string | number,
  ): Promise<DeleteResult>;
  protected abstract countImplementation(where?: Partial<T>): Promise<number>;
  protected abstract createManyImplementation(data: Partial<T>[]): Promise<T[]>;
  protected abstract deleteManyImplementation(
    where: Partial<T>,
  ): Promise<DeleteResult>;

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.findAllImplementation(options);
  }

  async findById(id: string | number): Promise<T | null> {
    return this.findOneImplementation({
      where: { id } as unknown as Partial<T>,
    });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.findOneImplementation(options);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.createImplementation(data);
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const result = await this.updateImplementation(id, data);
    if (result.affected && result.affected > 0) {
      return this.findById(id);
    }
    return null;
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.deleteImplementation(id);
    return result.affected ? result.affected > 0 : false;
  }

  async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.countImplementation(where);
    return count > 0;
  }

  async count(where?: Partial<T>): Promise<number> {
    return this.countImplementation(where);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.createManyImplementation(data);
  }

  async deleteMany(where: Partial<T>): Promise<number> {
    const result = await this.deleteManyImplementation(where);
    return result.affected || 0;
  }

  protected mapFindOptions(options: FindOptions<T>): any {
    return options;
  }

  protected mapFindOneOptions(options: FindOneOptions<T>): any {
    return options;
  }

  async findAllPaginated(
    options?: FindOptions<T>,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    return this.findAllPaginatedImplementation(options, pagination);
  }

  protected abstract findAllPaginatedImplementation(
    options?: FindOptions<T>,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<T>>;
}

// Query operators for flexible querying
export type QueryOperators<T> = {
  $in?: T[];
  $notIn?: T[];
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $like?: string;
  $ilike?: string;
  $not?: T;
  $isNull?: boolean;
};

// Enhanced where clause that supports both direct values and operators
export type WhereCondition<T> = {
  [P in keyof T]?: T[P] | QueryOperators<T[P]>;
};

export interface FindOptions<T> {
  where?: WhereCondition<T>;
  select?: (keyof T)[];
  relations?: string[];
  order?: { [P in keyof T]?: 'ASC' | 'DESC' };
  take?: number;
  skip?: number;
}

export interface FindOneOptions<T> {
  where?: WhereCondition<T>;
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
  getById(id: string | number): Promise<T | null>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
  exists(where: WhereCondition<T>): Promise<boolean>;
  count(where?: WhereCondition<T>): Promise<number>;
  createMany(data: Partial<T>[]): Promise<T[]>;
  deleteMany(where: WhereCondition<T>): Promise<number>;
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
  protected abstract countImplementation(
    where?: WhereCondition<T>,
  ): Promise<number>;
  protected abstract createManyImplementation(data: Partial<T>[]): Promise<T[]>;
  protected abstract deleteManyImplementation(
    where: WhereCondition<T>,
  ): Promise<DeleteResult>;

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.findAllImplementation(options);
  }

  async getById(id: string | number): Promise<T | null> {
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
      return this.getById(id);
    }
    return null;
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.deleteImplementation(id);
    return result.affected ? result.affected > 0 : false;
  }

  async exists(where: WhereCondition<T>): Promise<boolean> {
    const count = await this.countImplementation(where);
    return count > 0;
  }

  async count(where?: WhereCondition<T>): Promise<number> {
    return this.countImplementation(where);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.createManyImplementation(data);
  }

  async deleteMany(where: WhereCondition<T>): Promise<number> {
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

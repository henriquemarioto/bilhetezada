import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {
  BaseRepository,
  DeleteResult,
  FindOneOptions,
  FindOptions,
  PaginatedResult,
  PaginationOptions,
  QueryOperators,
  UpdateResult,
  WhereCondition,
} from '../../core/common/base.repository';

export abstract class TypeOrmBaseRepository<
  T extends ObjectLiteral,
> extends BaseRepository<T> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    super();
    this.repository = repository;
  }

  protected async findAllImplementation(
    options?: FindOptions<T>,
  ): Promise<T[]> {
    const typeOrmOptions = this.mapToTypeOrmFindOptions(options);
    return this.repository.find(typeOrmOptions);
  }

  protected async findOneImplementation(
    options: FindOneOptions<T>,
  ): Promise<T | null> {
    const typeOrmOptions = this.mapToTypeOrmFindOneOptions(options);
    return this.repository.findOne(typeOrmOptions);
  }

  protected async createImplementation(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  protected async updateImplementation(
    id: string | number,
    data: Partial<T>,
  ): Promise<UpdateResult> {
    const result = await this.repository.update(id, data as any);
    return {
      affected: result.affected,
      raw: result.raw,
    };
  }

  protected async deleteImplementation(
    id: string | number,
  ): Promise<DeleteResult> {
    const result = await this.repository.delete(id);
    return {
      affected: result.affected ?? undefined,
      raw: result.raw,
    };
  }

  protected async countImplementation(
    where?: WhereCondition<T>,
  ): Promise<number> {
    const typeOrmWhere = this.mapWhereCondition(where);
    return this.repository.count({
      where: typeOrmWhere as FindOptionsWhere<T>,
    });
  }

  protected async createManyImplementation(data: Partial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data as DeepPartial<T>[]);
    return this.repository.save(entities);
  }

  protected async deleteManyImplementation(
    where: WhereCondition<T>,
  ): Promise<DeleteResult> {
    const typeOrmWhere = this.mapWhereCondition(where);
    const result = await this.repository.delete(
      typeOrmWhere as FindOptionsWhere<T>,
    );
    return {
      affected: result.affected ?? undefined,
      raw: result.raw,
    };
  }

  private mapToTypeOrmFindOptions(
    options?: FindOptions<T>,
  ): FindManyOptions<T> | undefined {
    if (!options) return undefined;

    return {
      where: this.mapWhereCondition(options.where) as FindOptionsWhere<T>,
      select: options.select as any,
      relations: options.relations,
      order: options.order as any,
      take: options.take,
      skip: options.skip,
    };
  }

  private mapToTypeOrmFindOneOptions(options: FindOneOptions<T>): {
    where: FindOptionsWhere<T>;
    select?: any;
    relations?: string[];
  } {
    return {
      where: this.mapWhereCondition(options.where) as FindOptionsWhere<T>,
      select: options.select as any,
      relations: options.relations,
    };
  }

  private mapWhereCondition(where?: WhereCondition<T>): any {
    if (!where) return undefined;

    const mapped: any = {};

    for (const [key, value] of Object.entries(where)) {
      if (value === null || value === undefined) {
        mapped[key] = value;
        continue;
      }

      // Check if value is an object with operators
      if (typeof value === 'object' && !Array.isArray(value)) {
        const operators = value as QueryOperators<any>;
        mapped[key] = this.mapOperators(operators);
      } else {
        // Direct value
        mapped[key] = value;
      }
    }

    return mapped;
  }

  private mapOperators(operators: QueryOperators<any>): any {
    const mapped: any = {};

    if (operators.$in !== undefined) {
      return In(operators.$in);
    }

    if (operators.$notIn !== undefined) {
      return Not(In(operators.$notIn));
    }

    if (operators.$gt !== undefined) {
      return MoreThan(operators.$gt);
    }

    if (operators.$gte !== undefined) {
      return MoreThanOrEqual(operators.$gte);
    }

    if (operators.$lt !== undefined) {
      return LessThan(operators.$lt);
    }

    if (operators.$lte !== undefined) {
      return LessThanOrEqual(operators.$lte);
    }

    if (operators.$like !== undefined) {
      return Like(operators.$like);
    }

    if (operators.$ilike !== undefined) {
      return ILike(operators.$ilike);
    }

    if (operators.$not !== undefined) {
      return Not(operators.$not);
    }

    if (operators.$isNull !== undefined) {
      return operators.$isNull ? IsNull() : Not(IsNull());
    }

    return mapped;
  }

  protected async findAllPaginatedImplementation(
    options?: FindOptions<T>,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const page = pagination?.page || 1;
    const limit = Math.min(pagination?.limit || 10, 100);
    const skip = (page - 1) * limit;

    const typeOrmOptions = this.mapToTypeOrmFindOptions(options);

    const [data, total] = await this.repository.findAndCount({
      ...typeOrmOptions,
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}

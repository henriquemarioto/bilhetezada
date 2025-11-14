import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  ObjectLiteral,
} from 'typeorm';
import {
  BaseRepository,
  FindOptions,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
  PaginationOptions,
  PaginatedResult,
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

  protected async createImplementation(data: unknown): Promise<T> {
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

  protected async countImplementation(where?: Partial<T>): Promise<number> {
    return this.repository.count({
      where: where as FindOptionsWhere<T>,
    });
  }

  protected async createManyImplementation(data: Partial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data as DeepPartial<T>[]);
    return this.repository.save(entities);
  }

  protected async deleteManyImplementation(
    where: Partial<T>,
  ): Promise<DeleteResult> {
    const result = await this.repository.delete(where as FindOptionsWhere<T>);
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
      where: options.where as FindOptionsWhere<T>,
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
      where: options.where as FindOptionsWhere<T>,
      select: options.select as any,
      relations: options.relations,
    };
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

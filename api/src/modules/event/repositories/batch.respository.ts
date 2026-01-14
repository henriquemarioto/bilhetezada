import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Event } from '../entities/event.entity';
import { Batch } from '../entities/batch.entity';
import { CreateBatchDto } from '../dtos/create-batch.dto';
import { UpdateBatchDto } from '../dtos/update-batch.dto';

@Injectable()
export class BatchRepository extends TypeOrmBaseRepository<Batch> {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {
    super(batchRepository);
  }

  async createBatch(data: CreateBatchDto): Promise<Batch> {
    return this.createImplementation(data);
  }

  async getBatchesByEventId(eventId: string): Promise<Batch[]> {
    return this.findAllImplementation({
      where: { event_id: eventId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneById(batchId: string): Promise<Batch | null> {
    return this.findOneImplementation({
      where: { id: batchId },
    });
  }

  async findManyByEventIdPaginated(
    eventId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Batch>> {
    return this.findAllPaginated(
      {
        where: { event_id: eventId },
        order: { created_at: 'DESC' },
      },
      pagination,
    );
  }

  async updateBatch(
    batchId: string,
    updateBatchDto: UpdateBatchDto,
  ): Promise<Event> {
    const result = await this.updateImplementation(batchId, updateBatchDto);
    return result.raw;
  }
}

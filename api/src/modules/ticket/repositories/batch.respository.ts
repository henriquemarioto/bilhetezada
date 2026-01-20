import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { CreateBatchDto } from '../dtos/create-batch.dto';
import { UpdateBatchDto } from '../dtos/update-batch.dto';
import { Batch } from '../entities/batch.entity';

@Injectable()
export class BatchRepository extends TypeOrmBaseRepository<Batch> {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {
    super(batchRepository);
  }

  async createBatch(eventId: string, ticketTypeId: string, createBatchDto: CreateBatchDto): Promise<Batch> {
    return this.createImplementation({
      ...createBatchDto,
      event_id: eventId,
      ticket_type_id: ticketTypeId,
    });
  }

  async getBatchesByEventId(eventId: string): Promise<Batch[]> {
    return this.findAllImplementation({
      where: { event_id: eventId },
      order: { created_at: 'DESC' },
    });
  }

  async getBatchByEventIdAndTicketTypeId(eventId: string, ticketTypeId: string): Promise<Batch | null> {
    return this.findOneImplementation({
      where: { event_id: eventId, ticket_type_id: ticketTypeId },
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

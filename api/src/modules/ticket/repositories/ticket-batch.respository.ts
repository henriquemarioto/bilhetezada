import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { CreateTicketBatchDto } from '../dtos/create-ticket-batch.dto';
import { UpdateTicketBatchDto } from '../dtos/update-batch.dto';
import { TicketBatch } from '../entities/ticket-batch.entity';

@Injectable()
export class TicketBatchRepository extends TypeOrmBaseRepository<TicketBatch> {
  constructor(
    @InjectRepository(TicketBatch)
    private readonly ticketBatchRepository: Repository<TicketBatch>,
  ) {
    super(ticketBatchRepository);
  }

  async createTicketBatch(data: CreateTicketBatchDto): Promise<TicketBatch> {
    return this.createImplementation(data);
  }

  async getTicketBatchesByEventId(eventId: string): Promise<TicketBatch[]> {
    return this.findAllImplementation({
      where: { event_id: eventId },
      order: { created_at: 'DESC' },
    });
  }

  async findOneById(ticketBatchId: string): Promise<TicketBatch | null> {
    return this.findOneImplementation({
      where: { id: ticketBatchId },
    });
  }

  async findManyByEventIdPaginated(
    eventId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<TicketBatch>> {
    return this.findAllPaginated(
      {
        where: { event_id: eventId },
        order: { created_at: 'DESC' },
      },
      pagination,
    );
  }

  async updateTicketBatch(
    ticketBatchId: string,
    updateTicketBatchDto: UpdateTicketBatchDto,
  ): Promise<Event> {
    const result = await this.updateImplementation(ticketBatchId, updateTicketBatchDto);
    return result.raw;
  }
}

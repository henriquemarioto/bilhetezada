import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTicketBatchDto } from '../dtos/update-batch.dto';
import { TicketBatch } from '../entities/ticket-batch.entity';
import { TicketBatchRepository } from '../repositories/ticket-batch.respository';

@Injectable()
export class TicketBatchService {
  constructor(private batchesRepository: TicketBatchRepository) {}

  async getById(ticketBatchId: string): Promise<TicketBatch> {
    const batch = await this.batchesRepository.findOneById(ticketBatchId);

    if (!batch) throw new NotFoundException('Batch not found');

    return batch;
  }

  async findManyPaginated(
    eventId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<TicketBatch>> {
    const batchs = await this.batchesRepository.findManyByEventIdPaginated(
      eventId,
      pagination,
    );

    return batchs;
  }

  async update(
    ticketBatchId: string,
    updateBatchDto: UpdateTicketBatchDto,
  ): Promise<boolean> {
    const batch = await this.batchesRepository.findOne({
      where: {
        id: ticketBatchId,
      },
    });

    if (!batch) {
      throw new NotFoundException(
        'Batch not found or the user does not own this batch.',
      );
    }

    await this.batchesRepository.updateBatch(ticketBatchId, updateBatchDto);

    return true;
  }
}

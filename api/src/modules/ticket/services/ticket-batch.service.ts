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
  constructor(private ticketBatchesRepository: TicketBatchRepository) {}

  async getById(ticketBatchId: string): Promise<TicketBatch> {
    const batch = await this.ticketBatchesRepository.findOneById(ticketBatchId);

    if (!batch) throw new NotFoundException('Batch not found');

    return batch;
  }

  async findManyPaginated(
    eventId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<TicketBatch>> {
    const ticketBatches = await this.ticketBatchesRepository.findManyByEventIdPaginated(
      eventId,
      pagination,
    );

    return ticketBatches;
  }

  async update(
    ticketBatchId: string,
    updateTicketBatchDto: UpdateTicketBatchDto,
  ): Promise<boolean> {
    const batch = await this.ticketBatchesRepository.findOne({
      where: {
        id: ticketBatchId,
      },
    });

    if (!batch) {
      throw new NotFoundException(
        'Batch not found or the user does not own this batch.',
      );
    }

    await this.ticketBatchesRepository.updateTicketBatch(ticketBatchId, updateTicketBatchDto);

    return true;
  }
}

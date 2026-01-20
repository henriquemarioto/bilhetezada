import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBatchDto } from '../dtos/update-batch.dto';
import { Batch } from '../entities/batch.entity';
import { BatchRepository } from '../repositories/batch.respository';

@Injectable()
export class TicketTypeService {
  constructor(private batchesRepository: BatchRepository) {}

  async getById(batchId: string): Promise<Batch> {
    const batch = await this.batchesRepository.findOneById(batchId);

    if (!batch) throw new NotFoundException('Batch not found');

    return batch;
  }

  async findManyPaginated(
    eventId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Batch>> {
    const batches = await this.batchesRepository.findManyByEventIdPaginated(
      eventId,
      pagination,
    );

    return batches;
  }

  async update(
    batchId: string,
    updateBatchDto: UpdateBatchDto,
  ): Promise<boolean> {
    const batch = await this.batchesRepository.findOne({
      where: {
        id: batchId,
      },
    });

    if (!batch) {
      throw new NotFoundException(
        'Batch not found or the user does not own this batch.',
      );
    }

    await this.batchesRepository.updateBatch(batchId, updateBatchDto);

    return true;
  }
}

import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EventRepository } from '../../event/repositories/event.respository';
import {
  CreateBatchDto,
} from '../dtos/create-batch.dto';
import { Batch } from '../entities/batch.entity';
import { BatchRepository } from '../repositories/batch.respository';

@Injectable()
export class CreateBatchUseCase {
  constructor(
    private readonly batchRepository: BatchRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(
    eventId: string,
    ticketTypeId: string,
    createBatchDto: CreateBatchDto,
  ): Promise<Batch> {
    const event = await this.eventRepository.getById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const eventBatches =
      await this.batchRepository.getBatchesByEventId(eventId);

    let batchesCapacity = 0;

    for (const batch of eventBatches) {
      batchesCapacity += batch.quantity;
    }

    if (
      batchesCapacity + createBatchDto.ticketQuantity >
      event.capacity
    ) {
      throw new UnprocessableEntityException('Total ticket quantity exceeds event capacity');
    }

    const batch =
      await this.batchRepository.createBatch(eventId, ticketTypeId, createBatchDto);

    return batch;
  }
}

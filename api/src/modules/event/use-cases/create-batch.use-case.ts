import {
  Injectable,
} from '@nestjs/common';
import { BatchRepository } from '../repositories/batch.respository';
import { CreateBatchDto } from '../dtos/create-batch.dto';
import { Batch } from '../entities/batch.entity';
import { EventRepository } from '../repositories/event.respository';

@Injectable()
export class CreateBatchUseCase {
  constructor(
    private readonly batchRepository: BatchRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(
    eventId: string,
    createBatchDto: CreateBatchDto,
  ): Promise<Batch> {
    const event = await this.eventRepository.getById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    const eventBatches = await this.batchRepository.getBatchesByEventId(eventId);

    let batchesCapacity = 0;

    for (const batch of eventBatches) {
      batchesCapacity += batch.ticket_quantity;
    }

    if (batchesCapacity + createBatchDto.ticketQuantity > event.capacity) {
      throw new Error('Total ticket quantity exceeds event capacity');
    }

    const batch = await this.batchRepository.createBatch(createBatchDto);

    return batch;
  }
}

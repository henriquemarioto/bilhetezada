import {
  Injectable,
} from '@nestjs/common';
import { EventRepository } from '../../event/repositories/event.respository';
import { CreateTicketBatchDto } from '../dtos/create-ticket-batch.dto';
import { TicketBatch } from '../entities/ticket-batch.entity';
import { TicketBatchRepository } from '../repositories/ticket-batch.respository';

@Injectable()
export class CreateTicketBatchUseCase {
  constructor(
    private readonly ticketBatchRepository: TicketBatchRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(
    eventId: string,
    createTicketBatchDto: CreateTicketBatchDto,
  ): Promise<TicketBatch> {
    const event = await this.eventRepository.getById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    const eventBatches = await this.ticketBatchRepository.getBatchesByEventId(eventId);

    let batchesCapacity = 0;

    for (const batch of eventBatches) {
      batchesCapacity += batch.ticket_quantity;
    }

    if (batchesCapacity + createTicketBatchDto.ticketQuantity > event.capacity) {
      throw new Error('Total ticket quantity exceeds event capacity');
    }

    const batch = await this.ticketBatchRepository.createBatch(createTicketBatchDto);

    return batch;
  }
}

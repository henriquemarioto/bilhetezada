import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTicketTypeDto } from '../dtos/create-ticket-type.dto';
import { TicketTypeRepository } from '../repositories/ticket-type.respository';

@Injectable()
export class CreateTicketTypeUseCase {
  constructor(private readonly ticketTypeRepository: TicketTypeRepository) {}

  async execute(
    eventId: string,
    createTicketTypeDto: CreateTicketTypeDto,
  ): Promise<void> {
    const ticketTypeAlreadyExistsForThisEvent =
      await this.ticketTypeRepository.findOneByNameAndEventId(eventId, createTicketTypeDto.name);

    if (ticketTypeAlreadyExistsForThisEvent) {
      throw new ConflictException('Ticket type already exists for this event.');
    }

    await this.ticketTypeRepository.createTicketType(
      eventId,
      createTicketTypeDto,
    );
  }
}

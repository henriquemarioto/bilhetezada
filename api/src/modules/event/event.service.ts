import { Event } from './entities/event.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateEventDTO } from './dtos/update-event.dto';
import { EventRepository } from './repositories/event.respository';
import {
  PaginatedResult,
  PaginationOptions,
} from 'src/core/common/base.repository';

@Injectable()
export class EventService {
  constructor(private eventsRepository: EventRepository) {}

  async getById(eventId: string, userId?: string): Promise<Event> {
    const event = await this.eventsRepository.findOneById(eventId);

    if (!event) throw new NotFoundException('Event not found');

    if (userId && event.customer.id != userId) {
      throw new UnauthorizedException(
        'This event does not belong to this customer',
      );
    }

    return event;
  }

  async findManyPaginated(
    customerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Event>> {
    const events = await this.eventsRepository.findManyByCustomerIdPaginated(
      customerId,
      pagination,
    );

    return events;
  }

  async update(
    customerId: string,
    eventId: string,
    updateEventDto: UpdateEventDTO,
  ): Promise<boolean> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        customer_id: customerId,
      },
    });

    if (!event) {
      throw new NotFoundException(
        'Event not found or the customer does not own this event.',
      );
    }

    await this.eventsRepository.updateEvent(eventId, updateEventDto);

    return true;
  }

  async disable(customerId: string, eventId: string): Promise<boolean> {
    await this.update(customerId, eventId, { active: false });
    return true;
  }
}

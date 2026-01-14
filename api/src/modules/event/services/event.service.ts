import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.respository';

@Injectable()
export class EventService {
  constructor(private eventsRepository: EventRepository) {}

  async getById(eventId: string): Promise<Event> {
    const event = await this.eventsRepository.findOneById(eventId);

    if (!event) throw new NotFoundException('Event not found');

    return event;
  }

  async findManyPaginated(
    userId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Event>> {
    const events = await this.eventsRepository.findManyByUserIdPaginated(
      userId,
      pagination,
    );

    return events;
  }

  async update(
    userId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<boolean> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        organizer_user_id: userId,
      },
    });

    if (!event) {
      throw new NotFoundException(
        'Event not found or the user does not own this event.',
      );
    }

    await this.eventsRepository.updateEvent(eventId, updateEventDto);

    return true;
  }

  async disable(userId: string, eventId: string): Promise<boolean> {
    await this.update(userId, eventId, { active: false });
    return true;
  }
}

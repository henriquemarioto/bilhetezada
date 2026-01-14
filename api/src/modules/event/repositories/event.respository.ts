import { User } from '@/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginatedResult,
  PaginationOptions,
} from '@/core/common/base.repository';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { Event } from '../entities/event.entity';

type CreateEventData = CreateEventDto & {
  slug: string;
  user: User;
};

@Injectable()
export class EventRepository extends TypeOrmBaseRepository<Event> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
    super(eventRepository);
  }

  async createEvent(data: CreateEventData): Promise<Event> {
    return this.createImplementation(data);
  }

  async findOneById(eventId: string): Promise<Event | null> {
    return this.findOneImplementation({
      where: { id: eventId },
      relations: ['user', 'orders'],
    });
  }

  async findManyByUserIdPaginated(
    userId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Event>> {
    return this.findAllPaginated(
      {
        where: { organizer_user_id: userId },
        order: { created_at: 'DESC' },
      },
      pagination,
    );
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const result = await this.updateImplementation(eventId, updateEventDto);
    return result.raw;
  }
}

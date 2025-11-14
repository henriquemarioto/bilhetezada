import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '../../../core/common/typeorm.base.repository';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dtos/create-event.dto';
import { Customer } from 'src/infrastructure/database/typeorm/entities/customer.entity';
import {
  PaginatedResult,
  PaginationOptions,
} from 'src/core/common/base.repository';
import { UpdateEventDTO } from '../dtos/update-event.dto';

type CreateEventData = CreateEventDto & {
  slug: string;
  customer: Customer;
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
      relations: ['customer', 'orders'],
    });
  }

  async findManyByCustomerIdPaginated(
    customerId: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<Event>> {
    return this.findAllPaginated(
      {
        where: { customer_id: customerId },
        order: { created_at: 'DESC' },
      },
      pagination,
    );
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDTO,
  ): Promise<Event> {
    const result = await this.updateImplementation(eventId, updateEventDto);
    return result.raw;
  }
}

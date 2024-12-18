import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TimezoneService from '../timezone/timezone.service';
import { Repository } from 'typeorm';
import { Event } from '../../database/typeorm/entities/event.entity';
import { CustomerService } from '../customer/customer.service';
import { SlugService } from '../shared/services/slug.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private slugService: SlugService,
    private customerService: CustomerService,
    private timezoneService: TimezoneService,
  ) {}

  async create(customerId: string, createEventDto: CreateEventDto) {
    const isValidTimezone = await this.timezoneService.isValidTimezone(
      createEventDto.time_zone,
    );

    if (!isValidTimezone) {
      throw new BadRequestException('Unsupported timezone');
    }

    const slug = this.slugService.slug(createEventDto.name);

    const slugAlreadyInUse = await this.eventsRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (slugAlreadyInUse) {
      throw new ConflictException('Slug already exists.');
    }

    const customer = await this.customerService.findById(customerId);

    const event = await this.eventsRepository.save({
      ...createEventDto,
      slug,
      customer,
    });

    return event;
  }

  async findMany(customerId: string) {
    const events = this.eventsRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer'],
    });
    if (!events) {
      throw new NotFoundException('No events found for this customer.');
    }
    return events;
  }

  async getById(eventId: string) {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    return event;
  }

  async update(
    customerId: string,
    eventId: string,
    updateEventDto: UpdateEventDTO,
  ) {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        customer: {
          id: customerId,
        },
      },
      relations: ['customer'],
    });

    if (!event) {
      throw new NotFoundException(
        'Event not found or the customer does not own this event.',
      );
    }

    await this.eventsRepository.update(eventId, updateEventDto);
    return true;
  }

  async disable(customerId: string, eventId: string) {
    await this.update(customerId, eventId, { active: false });
    return true;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../database/typeorm/entities/event.entity';
import { SlugService } from '../../shared/services/slug.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';
import { CustomerService } from '../customer/customer.service';
import TimezoneService from 'src/shared/services/timezone.service';

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
    try {
      const isValidTimezone = await this.timezoneService.isValidTimezone(
        createEventDto.time_zone,
      );

      if (!isValidTimezone) {
        throw new BadRequestException('Unsupported timezone');
      }

      console.log(
        createEventDto,
        await this.timezoneService.isValidTimezone(createEventDto.time_zone),
      );

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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  update(eventId: string, updateEventDto: UpdateEventDTO) {
    return this.eventsRepository.update(eventId, updateEventDto);
  }

  async disable(eventId: string) {
    await this.update(eventId, { active: false });
    return true;
  }
}

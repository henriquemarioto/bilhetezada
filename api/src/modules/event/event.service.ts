import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../database/typeorm/entities/event.entity';
import { SlugService } from '../../shared/services/slug.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private slugService: SlugService,
  ) {}

  async findMany(customerId: string) {
    const events = this.eventsRepository.find({ where: { customerId } });
    if (!events) {
      throw new NotFoundException('no events found');
    }
    return events;
  }

  async create(customerId: string, createEventDto: CreateEventDto) {
    try {
      const event = await this.eventsRepository.save({
        ...createEventDto,
        slug: this.slugService.slug(createEventDto.name),
      });
      return event;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`An error occurred while creating event`);
    }
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

import { SlugService } from '@/modules/shared/services/slug.service';
import TimezoneService from '@/modules/shared/services/timezone.service';
import { UserService } from '@/modules/user/services/user.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.respository';

@Injectable()
export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private userService: UserService,
    private slugService: SlugService,
    private timezoneService: TimezoneService,
  ) {}

  async execute(
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    const user = await this.userService.getById(userId);

    if (!user) throw new NotFoundException('User not found.');

    const isValidTimezone = this.timezoneService.isValidTimezone(
      createEventDto.time_zone,
    );

    if (!isValidTimezone) {
      throw new BadRequestException('Unsupported timezone');
    }

    let slug = this.slugService.create(createEventDto.name);

    const slugAlreadyInUse = await this.eventRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (slugAlreadyInUse) {
      slug = this.slugService.createWithUUID(createEventDto.name);
    }

    const event = await this.eventRepository.createEvent({
      name: createEventDto.name,
      description: createEventDto.description,
      capacity: createEventDto.capacity,
      place_name: createEventDto.place_name,
      address: createEventDto.address,
      city: createEventDto.city,
      state: createEventDto.state,
      latitude: createEventDto.latitude,
      longitude: createEventDto.longitude,
      start_time: createEventDto.start_time,
      end_time: createEventDto.end_time,
      time_zone: createEventDto.time_zone,
      entrance_limit_time: createEventDto.entrance_limit_time
        ? createEventDto.entrance_limit_time
        : undefined,
      slug,
      user,
    });

    return event;
  }
}

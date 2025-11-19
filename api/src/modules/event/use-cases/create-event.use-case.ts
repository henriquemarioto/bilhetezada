import { CustomerService } from '@/modules/customer/customer.service';
import { SlugService } from '@/modules/shared/services/slug.service';
import TimezoneService from '@/modules/shared/services/timezone.service';
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
    private customerService: CustomerService,
    private slugService: SlugService,
    private timezoneService: TimezoneService,
  ) {}

  async execute(
    customerId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    const customer = await this.customerService.findById(customerId);

    if (!customer) throw new NotFoundException('Customer not found.');

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
      ...createEventDto,
      start_time: createEventDto.start_time,
      end_time: createEventDto.end_time,
      entrance_limit_time: createEventDto.entrance_limit_time
        ? createEventDto.entrance_limit_time
        : undefined,
      limit_time_for_ticket_purchase:
        createEventDto.limit_time_for_ticket_purchase,
      slug,
      customer,
    });

    return event;
  }
}

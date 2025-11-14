import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';
import { EventRepository } from '../repositories/event.respository';
import { CustomerService } from '@/modules/customer/customer.service';
import { SlugService } from '@/modules/shared/services/slug.service';
import TimezoneService from '@/modules/shared/services/timezone.service';
import { Event } from '../entities/event.entity';

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
      slug,
      customer,
    });

    return event;
  }
}

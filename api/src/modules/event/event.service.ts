import { Event } from '@/entities/event.entity';
import { PaymentLink } from '@/entities/payment-link.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { PaymentLinkOwner } from '../shared/enums/payment-link-owner.enum';
import { SlugService } from '../shared/services/slug.service';
import TimezoneService from '../shared/services/timezone.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(PaymentLink)
    private paymentLinksRepository: Repository<PaymentLink>,
    private slugService: SlugService,
    private customerService: CustomerService,
    private timezoneService: TimezoneService,
  ) {}

  async create(
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

    let slug = this.slugService.slug(createEventDto.name);

    const slugAlreadyInUse = await this.eventsRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (slugAlreadyInUse) {
      slug = this.slugService.slugWithUUID(createEventDto.name);
    }

    const event = await this.eventsRepository.save({
      ...createEventDto,
      slug,
      customer,
    });

    await this.paymentLinksRepository.save({
      owner: PaymentLinkOwner.EVENT,
      url: slug,
      event: event,
    });

    return event;
  }

  async findMany(customerId: string): Promise<Event[]> {
    const events = await this.eventsRepository.find({
      where: { customer: { id: customerId } },
    });
    if (!events.length) {
      throw new NotFoundException('No events found for this customer.');
    }
    return events;
  }

  async getById(eventId: string, userId?: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: {
        id: eventId,
        customer: {
          id: userId,
        },
      },
      relations: {
        customer: true,
        paymentLinks: true,
        orders: true,
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    if (userId && event.customer.id != userId) {
      throw new UnauthorizedException(
        'This event does not belong to this customer',
      );
    }

    return event;
  }

  async update(
    customerId: string,
    eventId: string,
    updateEventDto: UpdateEventDTO,
  ): Promise<boolean> {
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

  async disable(customerId: string, eventId: string): Promise<boolean> {
    await this.update(customerId, eventId, { active: false });
    return true;
  }
}

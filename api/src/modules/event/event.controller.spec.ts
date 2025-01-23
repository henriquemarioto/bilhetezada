import { Test, TestingModule } from '@nestjs/testing';
import { RequestUser } from '../shared/dto/request-user.dto';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker/.';
import { Customer } from '../../database/typeorm/entities/customer.entity';
import { PaymentLinkOwner } from '../shared/enums/payment-link-owner.enum';
import { PaymentLink } from '../../database/typeorm/entities/payment-link.entity';
import { Event } from '../../database/typeorm/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { CustomerService } from '../customer/customer.service';
import { EventResponseDto } from './dto/event-response.dto';
import { UpdateEventDTO } from './dto/update-event.dto';

const customerId: string = randomUUID();

const mockedPaymentLink: PaymentLink = {
  id: randomUUID(),
  owner: PaymentLinkOwner.EVENT,
  url: faker.internet.url(),
  event: {} as Event,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockedEvent: Event = {
  id: randomUUID(),
  active: true,
  address: faker.location.streetAddress(),
  description: 'Halloween party in te hood',
  name: 'Halloween party',
  price: 2000,
  slug: 'halloween-party',
  limit_time_for_ticket_purchase: new Date(),
  start_time: new Date(),
  end_time: new Date(),
  time_zone: 'America/Sao_Paulo',
  created_at: new Date(),
  updated_at: new Date(),
  customer: {
    id: customerId,
  } as Customer,
  orders: [],
  entrance_limit_time: null,
  paymentLinks: [mockedPaymentLink],
};

const createEventDto: CreateEventDto = {
  address: faker.location.streetAddress(),
  description: 'Halloween party in te hood',
  name: 'Halloween party',
  price: 2000,
  limit_time_for_ticket_purchase: new Date().toISOString(),
  start_time: new Date().toISOString(),
  end_time: new Date().toISOString(),
  time_zone: 'America/Sao_Paulo',
  entrance_limit_time: null,
};

const updateEventDto: UpdateEventDTO = {
  name: 'Halloween cool party',
};

describe('EventController', () => {
  let eventController: EventController;
  let mockedEventService: jest.Mocked<EventService>;
  const requestUser: RequestUser = { userId: 'id', userName: 'name' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockedEvent),
            getById: jest.fn().mockResolvedValue(mockedEvent),
            findMany: jest.fn().mockResolvedValue([mockedEvent, mockedEvent]),
            update: jest.fn().mockResolvedValue(true),
            disable: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: CustomerService,
          useValue: {},
        },
      ],
    }).compile();

    eventController = module.get<EventController>(EventController);
    mockedEventService = module.get<jest.Mocked<EventService>>(EventService);
  });

  it('should be defined', () => {
    expect(eventController).toBeDefined();
    expect(mockedEventService).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create event and return undefined', async () => {
      const result = await eventController.createEvent(
        createEventDto,
        requestUser,
      );

      expect(result).toBe(undefined);
      expect(mockedEventService.create).toHaveBeenCalledWith(
        requestUser.userId,
        createEventDto,
      );
    });
  });

  describe('getEvent', () => {
    it('should return a instance of EventResponseDto', async () => {
      const result = await eventController.getEvent(
        mockedEvent.id,
        requestUser,
      );

      expect(result).toBeInstanceOf(EventResponseDto);
      expect(mockedEventService.getById).toHaveBeenCalledWith(
        mockedEvent.id,
        requestUser.userId,
      );
    });
  });

  describe('getCustomerEvents', () => {
    it('should return a array EventResponseDto instance', async () => {
      const result = await eventController.getCustomerEvents(requestUser);

      expect(Array.isArray(result)).toBe(true);
      expect(result.every((event) => event instanceof EventResponseDto)).toBe(
        true,
      );
      expect(mockedEventService.findMany).toHaveBeenCalledWith(
        requestUser.userId,
      );
    });
  });

  describe('updateEvent', () => {
    it('should call with correct parameters and return undefined', async () => {
      const result = await eventController.updateEvent(
        mockedEvent.id,
        updateEventDto,
        requestUser,
      );

      expect(result).toBeUndefined();
      expect(mockedEventService.update).toHaveBeenCalledWith(
        requestUser.userId,
        mockedEvent.id,
        updateEventDto,
      );
    });
  });

  describe('deleteEvent', () => {
    it('should call with correct parameters and return undefined', async () => {
      const result = await eventController.deleteEvent(
        mockedEvent.id,
        requestUser,
      );

      expect(result).toBeUndefined();
      expect(mockedEventService.disable).toHaveBeenCalledWith(
        requestUser.userId,
        mockedEvent.id,
      );
    });
  });
});

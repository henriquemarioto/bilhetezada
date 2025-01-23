import { EventService } from './event.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Event } from '../../database/typeorm/entities/event.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import { randomUUID } from 'crypto';
import { PaymentLinkOwner } from '../shared/enums/payment-link-owner.enum';
import { Customer } from '../../database/typeorm/entities/customer.entity';
import { PaymentLink } from '../../database/typeorm/entities/payment-link.entity';
import { SlugService } from '../shared/services/slug.service';
import { CustomerService } from '../customer/customer.service';
import TimezoneService from '../shared/services/timezone.service';
import { CreateEventDto } from './dto/create-event.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateEventDTO } from './dto/update-event.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

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

describe('EventService', () => {
  let eventService: EventService;
  let mockedSlugService: jest.Mocked<SlugService>;
  let mockedCustomerService: jest.Mocked<CustomerService>;
  let mockedTimeZoneService: jest.Mocked<TimezoneService>;
  let eventRepository: MockRepository<Event>;
  let paymentLinkRepository: MockRepository<PaymentLink>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: SlugService,
          useValue: {
            slug: jest.fn().mockReturnValue('sluged'),
            slugWithUUID: jest.fn().mockReturnValue('slugedUUID'),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            findById: jest.fn().mockReturnValue({} as Customer),
          },
        },
        {
          provide: TimezoneService,
          useValue: {
            isValidTimezone: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: getRepositoryToken(Event),
          useValue: {
            find: jest.fn().mockResolvedValue([mockedEvent, mockedEvent]),
            update: jest.fn().mockResolvedValue(mockedEvent),
            findOne: jest.fn().mockResolvedValue(mockedEvent),
            save: jest.fn().mockResolvedValue(mockedEvent),
          },
        },
        {
          provide: getRepositoryToken(PaymentLink),
          useValue: {
            save: jest.fn().mockResolvedValue(mockedPaymentLink),
          },
        },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    mockedSlugService = module.get<jest.Mocked<SlugService>>(SlugService);
    mockedCustomerService =
      module.get<jest.Mocked<CustomerService>>(CustomerService);
    mockedTimeZoneService =
      module.get<jest.Mocked<TimezoneService>>(TimezoneService);
    eventRepository = module.get<MockRepository<Event>>(
      getRepositoryToken(Event),
    );
    paymentLinkRepository = module.get<MockRepository<PaymentLink>>(
      getRepositoryToken(PaymentLink),
    );
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
    expect(mockedSlugService).toBeDefined();
    expect(mockedCustomerService).toBeDefined();
    expect(mockedTimeZoneService).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(paymentLinkRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a event', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      const result = await eventService.create(customerId, createEventDto);

      expect(result).toStrictEqual(mockedEvent);
      expect(mockedCustomerService.findById).toHaveBeenCalledWith(customerId);
      expect(mockedTimeZoneService.isValidTimezone).toHaveBeenCalledWith(
        createEventDto.time_zone,
      );
      expect(mockedSlugService.slug).toHaveBeenCalledWith(createEventDto.name);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          slug: 'sluged',
        },
      });
      expect(mockedSlugService.slugWithUUID).not.toHaveBeenCalled();
      expect(eventRepository.save).toHaveBeenCalledWith({
        ...createEventDto,
        slug: 'sluged',
        customer: {} as Customer,
      });
      expect(paymentLinkRepository.save).toHaveBeenCalledWith({
        owner: PaymentLinkOwner.EVENT,
        url: 'sluged',
        event: mockedEvent,
      });
    });

    it('should create and return a event with existing slug', async () => {
      const result = await eventService.create(customerId, createEventDto);

      expect(result).toStrictEqual(mockedEvent);
      expect(mockedCustomerService.findById).toHaveBeenCalledWith(customerId);
      expect(mockedTimeZoneService.isValidTimezone).toHaveBeenCalledWith(
        createEventDto.time_zone,
      );
      expect(mockedSlugService.slug).toHaveBeenCalledWith(createEventDto.name);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          slug: 'sluged',
        },
      });
      expect(mockedSlugService.slugWithUUID).toHaveBeenCalledWith(
        createEventDto.name,
      );
      expect(eventRepository.save).toHaveBeenCalledWith({
        ...createEventDto,
        slug: 'slugedUUID',
        customer: {} as Customer,
      });
      expect(paymentLinkRepository.save).toHaveBeenCalledWith({
        owner: PaymentLinkOwner.EVENT,
        url: 'slugedUUID',
        event: mockedEvent,
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockedCustomerService.findById.mockResolvedValue(null);

      await expect(
        eventService.create(mockedEvent.id, createEventDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockedCustomerService.findById).toHaveBeenCalledWith(
        mockedEvent.id,
      );
    });

    it('should throw BadRequestException if TimeZone is invalid', async () => {
      mockedTimeZoneService.isValidTimezone.mockReturnValue(false);

      await expect(
        eventService.create(mockedEvent.id, createEventDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockedCustomerService.findById).toHaveBeenCalledWith(
        mockedEvent.id,
      );
      expect(mockedTimeZoneService.isValidTimezone).toHaveBeenCalledWith(
        createEventDto.time_zone,
      );
    });
  });

  describe('findMany', () => {
    it('should return events', async () => {
      const result = await eventService.findMany(mockedEvent.id);

      expect(result).toStrictEqual([mockedEvent, mockedEvent]);
      expect(eventRepository.find).toHaveBeenCalledWith({
        where: { customer: { id: mockedEvent.id } },
      });
    });

    it('should throw NotFoundException if not found eventrs', async () => {
      eventRepository.find.mockResolvedValue([]);

      await expect(eventService.findMany(mockedEvent.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(eventRepository.find).toHaveBeenCalledWith({
        where: { customer: { id: mockedEvent.id } },
      });
    });
  });

  describe('getById', () => {
    it('should be find and return a event', async () => {
      const result = await eventService.getById(mockedEvent.id, customerId);

      expect(result).toStrictEqual(mockedEvent);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockedEvent.id,
          customer: {
            id: customerId,
          },
        },
        relations: {
          customer: true,
          paymentLinks: true,
          orders: true,
        },
      });
    });

    it('should throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(
        eventService.getById(mockedEvent.id, customerId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if customer is not owner', async () => {
      await expect(
        eventService.getById(mockedEvent.id, 'randomUUID'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('shold be update and return true', async () => {
      const result = await eventService.update(
        customerId,
        mockedEvent.id,
        {} as UpdateEventDTO,
      );

      expect(result).toEqual(true);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockedEvent.id,
          customer: {
            id: customerId,
          },
        },
        relations: ['customer'],
      });
      expect(eventRepository.update).toHaveBeenCalledWith(mockedEvent.id, {});
    });

    it('shold throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(
        eventService.update(customerId, mockedEvent.id, {} as UpdateEventDTO),
      ).rejects.toThrow(NotFoundException);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockedEvent.id,
          customer: {
            id: customerId,
          },
        },
        relations: ['customer'],
      });
      expect(eventRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('disable', () => {
    it('should disable event and return true', async () => {
      const updateSpy = jest.spyOn(eventService, 'update');

      updateSpy.mockResolvedValue(true);

      const result = await eventService.disable(customerId, mockedEvent.id);

      expect(result).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(customerId, mockedEvent.id, {
        active: false,
      });
    });
  });
});

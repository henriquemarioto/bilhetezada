import { Event } from '@/entities/event.entity';
import { PaymentLink } from '@/entities/payment-link.entity';
import { User } from '@/modules/user/entities/user.entity';
import { createEventDtoFactory } from '@/test/factories/dto/create-event.dto.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { paymentLinkFactory } from '@/test/factories/entity/payment-link.factory';
import { userFactory } from '@/test/factories/entity/user.factory';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentLinkOwner } from '../../../shared/enums/payment-link-owner.enum';
import { SlugService } from '../../shared/services/slug.service';
import TimezoneService from '../../shared/services/timezone.service';
import { UserService } from '../../user/services/user.service';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDTO } from '../dtos/update-event.dto';
import { EventService } from './event.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockedUser: User = userFactory();

const mockedEvent: Event = eventFactory({ user: mockedUser });

const mockedPaymentLink: PaymentLink = paymentLinkFactory({
  event: mockedEvent,
});

const createEventDto: CreateEventDto = createEventDtoFactory();

describe('EventService', () => {
  let eventService: EventService;
  let mockedSlugService: jest.Mocked<SlugService>;
  let mockedUserService: jest.Mocked<UserService>;
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
          provide: UserService,
          useValue: {
            getById: jest.fn().mockReturnValue({} as User),
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
    mockedUserService = module.get<jest.Mocked<UserService>>(UserService);
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
    expect(mockedUserService).toBeDefined();
    expect(mockedTimeZoneService).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(paymentLinkRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a event', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      const result = await eventService.create(mockedUser.id, createEventDto);

      expect(result).toStrictEqual(mockedEvent);
      expect(mockedUserService.getById).toHaveBeenCalledWith(mockedUser.id);
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
        user: {} as User,
      });
      expect(paymentLinkRepository.save).toHaveBeenCalledWith({
        owner: PaymentLinkOwner.EVENT,
        url: 'sluged',
        event: mockedEvent,
      });
    });

    it('should create and return a event with existing slug', async () => {
      const result = await eventService.create(mockedUser.id, createEventDto);

      expect(result).toStrictEqual(mockedEvent);
      expect(mockedUserService.getById).toHaveBeenCalledWith(mockedUser.id);
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
        user: {} as User,
      });
      expect(paymentLinkRepository.save).toHaveBeenCalledWith({
        owner: PaymentLinkOwner.EVENT,
        url: 'slugedUUID',
        event: mockedEvent,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockedUserService.getById.mockResolvedValue(null);

      await expect(
        eventService.create(mockedEvent.id, createEventDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockedUserService.getById).toHaveBeenCalledWith(mockedEvent.id);
    });

    it('should throw BadRequestException if TimeZone is invalid', async () => {
      mockedTimeZoneService.isValidTimezone.mockReturnValue(false);

      await expect(
        eventService.create(mockedEvent.id, createEventDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockedUserService.getById).toHaveBeenCalledWith(mockedEvent.id);
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
        where: { user: { id: mockedEvent.id } },
      });
    });

    it('should throw NotFoundException if not found eventrs', async () => {
      eventRepository.find.mockResolvedValue([]);

      await expect(eventService.findMany(mockedEvent.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(eventRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockedEvent.id } },
      });
    });
  });

  describe('getById', () => {
    it('should be find and return a event', async () => {
      const result = await eventService.getById(mockedEvent.id, mockedUser.id);

      expect(result).toStrictEqual(mockedEvent);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockedEvent.id,
          user: {
            id: mockedUser.id,
          },
        },
        relations: {
          user: true,
          paymentLinks: true,
          orders: true,
        },
      });
    });

    it('should throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(
        eventService.getById(mockedEvent.id, mockedUser.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not owner', async () => {
      await expect(
        eventService.getById(mockedEvent.id, 'randomUUID'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('shold be update and return true', async () => {
      const result = await eventService.update(
        mockedUser.id,
        mockedEvent.id,
        {} as UpdateEventDTO,
      );

      expect(result).toEqual(true);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockedEvent.id,
          user: {
            id: mockedUser.id,
          },
        },
        relations: ['user'],
      });
      expect(eventRepository.update).toHaveBeenCalledWith(mockedEvent.id, {});
    });

    it('shold throw NotFoundException if event not found', async () => {
      eventRepository.findOne.mockResolvedValue(null);

      await expect(
        eventService.update(
          mockedUser.id,
          mockedEvent.id,
          {} as UpdateEventDTO,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockedEvent.id,
          user: {
            id: mockedUser.id,
          },
        },
        relations: ['user'],
      });
      expect(eventRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('disable', () => {
    it('should disable event and return true', async () => {
      const updateSpy = jest.spyOn(eventService, 'update');

      updateSpy.mockResolvedValue(true);

      const result = await eventService.disable(mockedUser.id, mockedEvent.id);

      expect(result).toBe(true);
      expect(updateSpy).toHaveBeenCalledWith(mockedUser.id, mockedEvent.id, {
        active: false,
      });
    });
  });
});

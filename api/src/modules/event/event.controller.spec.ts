import { Customer } from '@/entities/customer.entity';
import { Event } from '@/entities/event.entity';
import { createEventDtoFactory } from '@/test/factories/dto/create-event.dto.factory';
import { customerFactory } from '@/test/factories/entity/customer.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestUser } from '../shared/dto/request-user.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { UpdateEventDTO } from './dto/update-event.dto';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';

const mockedCustomer: Customer = customerFactory();

const mockedEvent: Event = eventFactory({ customer: mockedCustomer });

const createEventDto: CreateEventDto = createEventDtoFactory();

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
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

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

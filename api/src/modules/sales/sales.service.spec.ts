import { Buyer } from '@/entities/buyer.entity';
import { Event } from '@/entities/event.entity';
import { Order } from '@/entities/order.entity';
import { EventService } from '@/modules/event/event.service';
import { createOrderDtoFactory } from '@/test/factories/dto/create-order.dto.factory';
import { openPixChargeResponseDtoFactory } from '@/test/factories/dto/openpix-charge-response.dto.factory';
import { buyerFactory } from '@/test/factories/entity/buyer.factory';
import { customerFactory } from '@/test/factories/entity/customer.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { orderFactory } from '@/test/factories/entity/order.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenPixService } from '../shared/services/openpix.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OpenPixChargeResponseDto } from './dto/openpix-charge-response.dto';
import { SalesService } from './sales.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockedEvent: Event = eventFactory({ customer: customerFactory() });

const mockedOrder: Order = orderFactory({ event: mockedEvent });

const mockedBuyer: Buyer = buyerFactory({ order: mockedOrder });

const mockedCreateOrderDto: CreateOrderDto = createOrderDtoFactory(
  mockedEvent.id,
);

const mockedOpenPixChargeResponse: OpenPixChargeResponseDto =
  openPixChargeResponseDtoFactory();

describe('SalesService', () => {
  let salesService: SalesService;
  let mockedEventSerivce: jest.Mocked<EventService>;
  let mockedOpenPixService: jest.Mocked<OpenPixService>;
  let ordersRepository: MockRepository<Order>;
  let buyersRepository: MockRepository<Buyer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: EventService,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockedEvent),
          },
        },
        {
          provide: OpenPixService,
          useValue: {
            generatePixCharge: jest
              .fn()
              .mockReturnValue(mockedOpenPixChargeResponse),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn().mockResolvedValue([mockedOrder, mockedOrder]),
            save: jest.fn().mockResolvedValue(mockedOrder),
          },
        },
        {
          provide: getRepositoryToken(Buyer),
          useValue: {
            save: jest.fn().mockResolvedValue(mockedBuyer),
          },
        },
      ],
    }).compile();

    salesService = module.get<SalesService>(SalesService);
    mockedEventSerivce = module.get<jest.Mocked<EventService>>(EventService);
    mockedOpenPixService =
      module.get<jest.Mocked<OpenPixService>>(OpenPixService);
    ordersRepository = module.get<MockRepository<Order>>(
      getRepositoryToken(Order),
    );
    buyersRepository = module.get<MockRepository<Buyer>>(
      getRepositoryToken(Buyer),
    );
  });

  it('should be defined', () => {
    expect(salesService).toBeDefined();
    expect(mockedEventSerivce).toBeDefined();
    expect(mockedOpenPixService).toBeDefined();
    expect(ordersRepository).toBeDefined();
    expect(buyersRepository).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order and return payment data', async () => {
      const result = await salesService.createOrder(mockedCreateOrderDto);

      expect(result).toStrictEqual({
        transactionReference:
          mockedOpenPixChargeResponse.data.charge.correlationID,
        qrcodeImageUrl: mockedOpenPixChargeResponse.data.charge.qrCodeImage,
        pixCopyPaste: mockedOpenPixChargeResponse.data.charge.brCode,
        value: mockedOpenPixChargeResponse.data.charge.value,
        expiresDate: mockedOpenPixChargeResponse.data.charge.expiresDate,
      });
      expect(mockedEventSerivce.getById).toHaveBeenCalledWith(
        mockedCreateOrderDto.eventId,
      );
      expect(buyersRepository.save).toHaveBeenCalledWith(
        mockedCreateOrderDto.buyer,
      );
      expect(mockedOpenPixService.generatePixCharge).toHaveBeenCalledWith(
        mockedEvent.price * 100,
      );

      const { eventId: _, ...mockedCreateOrderData } = mockedCreateOrderDto;

      expect(ordersRepository.save).toHaveBeenCalledWith({
        ...mockedCreateOrderData,
        value: mockedEvent.price,
        transaction_reference:
          mockedOpenPixChargeResponse.data.charge.correlationID,
        event: mockedEvent,
        buyer: mockedBuyer,
      });
    });

    it('should throw ForbiddenException if Ticket purchase time expired', async () => {
      const mockedEventPurchaseTimeExpired = { ...mockedEvent };
      mockedEventPurchaseTimeExpired.limit_time_for_ticket_purchase =
        new Date();

      mockedEventPurchaseTimeExpired.limit_time_for_ticket_purchase.setHours(
        mockedEventPurchaseTimeExpired.limit_time_for_ticket_purchase.getHours() -
          1,
      );

      mockedEventSerivce.getById.mockResolvedValue(
        mockedEventPurchaseTimeExpired,
      );

      await expect(
        salesService.createOrder(mockedCreateOrderDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getEventOrders', () => {
    it('should get event orders', async () => {
      const result = await salesService.getEventOrders(
        mockedEvent.id,
        mockedEvent.customer.id,
      );

      expect(result).toStrictEqual([mockedOrder, mockedOrder]);
      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          event: {
            id: mockedEvent.id,
          },
        },
      });
    });

    it('should throw NotFoundException if returns no orders', async () => {
      ordersRepository.find.mockResolvedValue([]);

      await expect(
        salesService.getEventOrders(mockedEvent.id, mockedEvent.customer.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

import { Buyer } from '@/entities/buyer.entity';
import { Event } from '@/entities/event.entity';
import { EventService } from '@/modules/event/services/event.service';
import { Order } from '@/modules/sales/entities/order.entity';
import { createTicketOrderDtoFactory } from '@/test/factories/dto/create-ticket-order.dto.factory';
import { wooviChargeResponseDtoFactory } from '@/test/factories/dto/woovi-charge-response.dto.factory';
import { buyerFactory } from '@/test/factories/entity/buyer.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { orderFactory } from '@/test/factories/entity/order.factory';
import { userFactory } from '@/test/factories/entity/user.factory';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WooviAdapter } from '../payment/adapters/woovi.adapter';
import { WooviChargeResponseDto } from '../payment/dtos/woovi-charge-response.dto';
import { CreateTicketOrderDto } from './dtos/create-ticket-order.dto';
import { SalesService } from './sales.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockedEvent: Event = eventFactory({ user: userFactory() });

const mockedOrder: Order = orderFactory({ event: mockedEvent });

const mockedBuyer: Buyer = buyerFactory({ order: mockedOrder });

const mockedCreateTicketOrderDto: CreateTicketOrderDto =
  createTicketOrderDtoFactory(mockedEvent.id);

const mockedWooviChargeResponse: WooviChargeResponseDto =
  wooviChargeResponseDtoFactory();

describe('SalesService', () => {
  let salesService: SalesService;
  let mockedEventSerivce: jest.Mocked<EventService>;
  let mockedWooviAdapter: jest.Mocked<WooviAdapter>;
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
          provide: WooviAdapter,
          useValue: {
            generatePixCharge: jest
              .fn()
              .mockReturnValue(mockedWooviChargeResponse),
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
    mockedWooviAdapter = module.get<jest.Mocked<WooviAdapter>>(WooviAdapter);
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
    expect(mockedWooviAdapter).toBeDefined();
    expect(ordersRepository).toBeDefined();
    expect(buyersRepository).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order and return payment data', async () => {
      const result = await salesService.createOrder(mockedCreateTicketOrderDto);

      expect(result).toStrictEqual({
        transactionReference:
          mockedWooviChargeResponse.data.charge.correlationID,
        qrcodeImageUrl: mockedWooviChargeResponse.data.charge.qrCodeImage,
        pixCopyPaste: mockedWooviChargeResponse.data.charge.brCode,
        value: mockedWooviChargeResponse.data.charge.value,
        expiresDate: mockedWooviChargeResponse.data.charge.expiresDate,
      });
      expect(mockedEventSerivce.getById).toHaveBeenCalledWith(
        mockedCreateTicketOrderDto.eventId,
      );
      expect(buyersRepository.save).toHaveBeenCalledWith(
        mockedCreateTicketOrderDto.buyer,
      );
      expect(mockedWooviAdapter.generatePixCharge).toHaveBeenCalledWith(
        mockedEvent.price * 100,
      );

      const { eventId: _, ...mockedCreateOrderData } =
        mockedCreateTicketOrderDto;

      expect(ordersRepository.save).toHaveBeenCalledWith({
        ...mockedCreateOrderData,
        value: mockedEvent.price,
        transaction_reference:
          mockedWooviChargeResponse.data.charge.correlationID,
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
        salesService.createOrder(mockedCreateTicketOrderDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getEventOrders', () => {
    it('should get event orders', async () => {
      const result = await salesService.getEventOrders(mockedEvent.id);

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
        salesService.getEventOrders(mockedEvent.id, mockedEvent.user.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

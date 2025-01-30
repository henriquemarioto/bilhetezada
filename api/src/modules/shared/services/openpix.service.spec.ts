import { Test, TestingModule } from '@nestjs/testing';
import { OpenPixService } from './openpix.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from './http.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { orderFactory } from '@/test/factories/entity/order.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { customerFactory } from '@/test/factories/entity/customer.factory';
import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { paymentFactory } from '@/test/factories/entity/payment.factory';
import { ticketFactory } from '@/test/factories/entity/ticket.factory';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { openPixPixWebhookBodyDtoFactory } from '@/test/factories/dto/openpix-pix-webhook-body.dto.factory';
import { PaymentMethods } from '../enums/payment-methods.enum';
import { OpenPixPixWebhookBodyDto } from '@/modules/sales/dto/openpix-pix-webhook-body.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrderStatus } from '../enums/order-status.enum';
import OpenPixChargeStatus from '../enums/openpix-charge-status.enum';

const openPixApiUrl = 'https://test.com.br';

const openPixAppId = '1234567890';

const mockedEvent = eventFactory({ customer: customerFactory() });

const mockedOrder: Order = orderFactory({ event: mockedEvent });

const mockedPayment: Payment = paymentFactory({ event: mockedEvent });

const mockedTicket: Ticket = ticketFactory({
  event: mockedEvent,
  order: mockedOrder,
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('OpenPixService', () => {
  let openPixService: OpenPixService;
  let mockedHttpService: jest.Mocked<HttpService>;
  let orderRepository: MockRepository<Order>;
  let paymentRepository: MockRepository<Payment>;
  let ticketRepository: MockRepository<Ticket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenPixService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'openPixApiUrl') return openPixApiUrl;
              if (key === 'openPixAppId') return openPixAppId;
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockResolvedValue({ data: {} }),
            post: jest.fn().mockResolvedValue({ data: {} }),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedOrder),
            update: jest.fn().mockResolvedValue(mockedOrder),
          },
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            save: jest.fn().mockResolvedValue(mockedPayment),
          },
        },
        {
          provide: getRepositoryToken(Ticket),
          useValue: {
            save: jest.fn().mockResolvedValue(mockedTicket),
          },
        },
      ],
    }).compile();

    openPixService = module.get<OpenPixService>(OpenPixService);
    mockedHttpService = module.get<jest.Mocked<HttpService>>(HttpService);
    orderRepository = module.get<MockRepository<Order>>(
      getRepositoryToken(Order),
    );
    paymentRepository = module.get<MockRepository<Payment>>(
      getRepositoryToken(Payment),
    );
    ticketRepository = module.get<MockRepository<Ticket>>(
      getRepositoryToken(Ticket),
    );
  });

  it('should be defined', () => {
    expect(openPixService).toBeDefined();
    expect(mockedHttpService).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(paymentRepository).toBeDefined();
    expect(ticketRepository).toBeDefined();
  });

  describe('generatePixCharge', () => {
    it('should generate a pix charge', async () => {
      expect(await openPixService.generatePixCharge(100)).toStrictEqual({
        data: {},
      });
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      mockedHttpService.post.mockResolvedValue(false);

      await expect(openPixService.generatePixCharge(100)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('webhookPix', () => {
    it('should create payment, update order and create ticket', async () => {
      const webhookBody: OpenPixPixWebhookBodyDto =
        openPixPixWebhookBodyDtoFactory();

      expect(await openPixService.webhookPix(webhookBody)).toBe(true);
      expect(paymentRepository.save).toHaveBeenCalledWith({
        method: PaymentMethods.PIX,
        transaction_reference: webhookBody.charge.correlationID,
        status: PaymentStatus.PAID,
        order: mockedOrder,
        value: webhookBody.pix.value / 100,
      });
      expect(orderRepository.update).toHaveBeenCalledWith(mockedOrder.id, {
        status: OrderStatus.CONFIRMED,
      });
      expect(ticketRepository.save).toHaveBeenCalledWith({
        event: mockedOrder.event,
        order: mockedOrder,
      });
    });

    it('should return true if charge status is not completed', async () => {
      expect(
        await openPixService.webhookPix(
          openPixPixWebhookBodyDtoFactory(OpenPixChargeStatus.EXPIRED),
        ),
      ).toBe(true);
      expect(paymentRepository.save).not.toHaveBeenCalled();
      expect(orderRepository.update).not.toHaveBeenCalled();
      expect(ticketRepository.save).not.toHaveBeenCalled();
    });
  });
});

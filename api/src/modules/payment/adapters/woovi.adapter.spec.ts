import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { WooviWebhookBodyDto } from '@/modules/payment/dtos/woovi-pix-webhook-body.dto';
import { Order } from '@/modules/sales/entities/order.entity';
import { wooviWebhookBodyDtoFactory } from '@/test/factories/dto/woovi-pix-webhook-body.dto.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { orderFactory } from '@/test/factories/entity/order.factory';
import { paymentFactory } from '@/test/factories/entity/payment.factory';
import { ticketFactory } from '@/test/factories/entity/ticket.factory';
import { userFactory } from '@/test/factories/entity/user.factory';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethods } from '../enums/payment-methods.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import WooviChargeStatus from '../enums/woovi-charge-status.enum';
import { HttpService } from './http.service';
import { WooviAdapter } from './woovi.adapter';

const wooviApiUrl = 'https://test.com.br';

const wooviAppId = '1234567890';

const mockedEvent = eventFactory({ user: userFactory() });

const mockedOrder: Order = orderFactory({ event: mockedEvent });

const mockedPayment: Payment = paymentFactory({ event: mockedEvent });

const mockedTicket: Ticket = ticketFactory({
  event: mockedEvent,
  order: mockedOrder,
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('WooviAdapter', () => {
  let wooviAdapter: WooviAdapter;
  let mockedHttpService: jest.Mocked<HttpService>;
  let orderRepository: MockRepository<Order>;
  let paymentRepository: MockRepository<Payment>;
  let ticketRepository: MockRepository<Ticket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WooviAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'wooviApiUrl') return wooviApiUrl;
              if (key === 'wooviAppId') return wooviAppId;
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

    wooviAdapter = module.get<WooviAdapter>(WooviAdapter);
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
    expect(wooviAdapter).toBeDefined();
    expect(mockedHttpService).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(paymentRepository).toBeDefined();
    expect(ticketRepository).toBeDefined();
  });

  describe('generatePixCharge', () => {
    it('should generate a pix charge', async () => {
      expect(await wooviAdapter.generatePixCharge(100)).toStrictEqual({
        data: {},
      });
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      mockedHttpService.post.mockResolvedValue(false);

      await expect(wooviAdapter.generatePixCharge(100)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('webhookPix', () => {
    it('should create payment, update order and create ticket', async () => {
      const webhookBody: WooviWebhookBodyDto =
        wooviWebhookBodyDtoFactory();

      expect(await wooviAdapter.webhookPix(webhookBody)).toBe(true);
      expect(paymentRepository.save).toHaveBeenCalledWith({
        method: PaymentMethods.PIX,
        transaction_reference: webhookBody.charge.correlationID,
        status: PaymentStatus.PAID,
        order: mockedOrder,
        value: webhookBody.pix.value,
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
        await wooviAdapter.webhookPix(
          wooviWebhookBodyDtoFactory(WooviChargeStatus.EXPIRED),
        ),
      ).toBe(true);
      expect(paymentRepository.save).not.toHaveBeenCalled();
      expect(orderRepository.update).not.toHaveBeenCalled();
      expect(ticketRepository.save).not.toHaveBeenCalled();
    });
  });
});

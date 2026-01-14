import { Order } from '@/modules/sales/entities/order.entity';
import { createOrderResponseDtoFactory } from '@/test/factories/dto/create-order-response.dto.factory';
import { createOrderDtoFactory } from '@/test/factories/dto/create-ticket-order.dto.factory';
import { wooviWebhookBodyDtoFactory } from '@/test/factories/dto/woovi-pix-webhook-body.dto.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { orderFactory } from '@/test/factories/entity/order.factory';
import { userFactory } from '@/test/factories/entity/user.factory';
import { requestUserFactory } from '@/test/factories/request-user.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestUser } from '../../shared/dtos/request-user.dto';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { WooviAdapter } from '../payment/adapters/woovi.adapter';
import { WooviWebhookBodyDto } from '../payment/dtos/woovi-pix-webhook-body.dto';
import { CreateOrderDto } from './dtos/create-ticket-order.dto';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

const mockedOrder: Order = orderFactory({
  event: eventFactory({ user: userFactory() }),
});

const mockedCreateOrderDto: CreateOrderDto = createOrderDtoFactory();

const mockedCreateOrderResponseDto = createOrderResponseDtoFactory();

const mockedRequestUser: RequestUser = requestUserFactory();

const mockedGetEventOrdersResponse = [mockedOrder, mockedOrder];

const mockedWooviPixWebhookBody: WooviWebhookBodyDto =
  wooviWebhookBodyDtoFactory();

describe('SalesController', () => {
  let salesController: SalesController;
  let mockedSalesService: jest.Mocked<SalesService>;
  let mockedWooviAdapter: jest.Mocked<WooviAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: {
            createOrder: jest
              .fn()
              .mockResolvedValue(mockedCreateOrderResponseDto),
            getEventOrders: jest
              .fn()
              .mockResolvedValue(mockedGetEventOrdersResponse),
          },
        },
        {
          provide: WooviAdapter,
          useValue: {
            webhookPix: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    salesController = module.get<SalesController>(SalesController);
    mockedSalesService = module.get<jest.Mocked<SalesService>>(SalesService);
    mockedWooviAdapter =
      module.get<jest.Mocked<WooviAdapter>>(WooviAdapter);
  });

  it('should be defined', () => {
    expect(salesController).toBeDefined();
    expect(mockedSalesService).toBeDefined();
    expect(mockedWooviAdapter).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call with correct parameters and return payment data', async () => {
      const result = await salesController.createOrder(mockedCreateOrderDto);

      expect(result).toStrictEqual(mockedCreateOrderResponseDto);
      expect(mockedSalesService.createOrder).toHaveBeenCalledWith(
        mockedCreateOrderDto,
      );
    });
  });

  describe('getEventOrders', () => {
    it('should be call with correct parameters and return orders', async () => {
      const result = await salesController.getEventOrders(
        mockedCreateOrderDto.eventId,
        mockedRequestUser,
      );

      expect(result).toStrictEqual({
        totalValue: mockedGetEventOrdersResponse.reduce(
          (acc, order) => acc + Number(order.value),
          0,
        ),
        orders: mockedGetEventOrdersResponse,
      });
      expect(mockedSalesService.getEventOrders).toHaveBeenCalledWith(
        mockedCreateOrderDto.eventId,
        mockedRequestUser.userId,
      );
    });
  });

  describe('webhookWooviPixPayment', () => {
    it('should be call with correct parameters and return true', async () => {
      const result = await salesController.webhookWooviPixPayment(
        mockedWooviPixWebhookBody,
      );

      expect(result).toStrictEqual(true);
      expect(mockedWooviAdapter.webhookPix).toHaveBeenCalledWith(
        mockedWooviPixWebhookBody,
      );
    });
  });
});

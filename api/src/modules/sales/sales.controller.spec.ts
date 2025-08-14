import { Order } from '@/entities/order.entity';
import { createOrderResponseDtoFactory } from '@/test/factories/dto/create-order-response.dto.factory';
import { createOrderDtoFactory } from '@/test/factories/dto/create-ticket-order.dto.factory';
import { openPixPixWebhookBodyDtoFactory } from '@/test/factories/dto/openpix-pix-webhook-body.dto.factory';
import { customerFactory } from '@/test/factories/entity/customer.factory';
import { eventFactory } from '@/test/factories/entity/event.factory';
import { orderFactory } from '@/test/factories/entity/order.factory';
import { requestUserFactory } from '@/test/factories/request-user.factory';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { OpenPixPixWebhookBodyDto } from '../payment/dto/openpix-pix-webhook-body.dto';
import { OpenPixService } from '../payment/services/openpix.service';
import { RequestUser } from '../shared/dto/request-user.dto';
import { CreateOrderDto } from './dto/create-ticket-order.dto';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

const mockedOrder: Order = orderFactory({
  event: eventFactory({ customer: customerFactory() }),
});

const mockedCreateOrderDto: CreateOrderDto = createOrderDtoFactory();

const mockedCreateOrderResponseDto = createOrderResponseDtoFactory();

const mockedRequestUser: RequestUser = requestUserFactory();

const mockedGetEventOrdersResponse = [mockedOrder, mockedOrder];

const mockedOpenPixPixWebhookBody: OpenPixPixWebhookBodyDto =
  openPixPixWebhookBodyDtoFactory();

describe('SalesController', () => {
  let salesController: SalesController;
  let mockedSalesService: jest.Mocked<SalesService>;
  let mockedOpenPixService: jest.Mocked<OpenPixService>;

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
          provide: OpenPixService,
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
    mockedOpenPixService =
      module.get<jest.Mocked<OpenPixService>>(OpenPixService);
  });

  it('should be defined', () => {
    expect(salesController).toBeDefined();
    expect(mockedSalesService).toBeDefined();
    expect(mockedOpenPixService).toBeDefined();
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

  describe('webhookOpenPixPixPayment', () => {
    it('should be call with correct parameters and return true', async () => {
      const result = await salesController.webhookOpenPixPixPayment(
        mockedOpenPixPixWebhookBody,
      );

      expect(result).toStrictEqual(true);
      expect(mockedOpenPixService.webhookPix).toHaveBeenCalledWith(
        mockedOpenPixPixWebhookBody,
      );
    });
  });
});

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { RequestUser } from '../shared/dto/request-user.dto';
import { OpenPixService } from '../shared/services/openpix.service';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OpenPixPixWebhookBodyDto } from './dto/openpix-pix-webhook-body.dto';
import { SalesService } from './sales.service';

@Controller()
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly openPixService: OpenPixService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'Pix payment informations',
    type: CreateOrderResponseDto,
  })
  @Post('create-order')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    return await this.salesService.createOrder(createOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-event-orders')
  async getEventOrders(
    @Query('eventId') eventId: string,
    @CurrentUser() user: RequestUser,
  ) {
    const orders = await this.salesService.getEventOrders(eventId, user.userId);
    return {
      totalValue: orders.reduce((acc, order) => acc + Number(order.value), 0),
      orders,
    };
  }

  @ApiBody({
    type: OpenPixPixWebhookBodyDto,
    isArray: false,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('webhook/openpix/pix')
  async webhookOpenPixPixPayment(@Body() body: any) {
    await this.openPixService.webhookPix(body);
    return true;
  }
}

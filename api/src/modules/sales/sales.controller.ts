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
import { CreateOrderDto } from './dto/create-order.dto';
import { SalesService } from './sales.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { RequestUser } from '../shared/dto/request-user.dto';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    await this.salesService.createOrder(createOrderDto);
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
}

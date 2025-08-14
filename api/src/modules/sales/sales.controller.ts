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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { RequestUser } from '../shared/dto/request-user.dto';
import { CreateTicketOrderResponseDto } from './dto/create-ticket-order-response.dto';
import { CreateTicketOrderDto } from './dto/create-ticket-order.dto';
import { SalesService } from './sales.service';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'Generate order and return payment data',
    type: CreateTicketOrderResponseDto,
  })
  @Post('create-ticket-order')
  async createTicketOrder(
    @Body() createTicketOrderDto: CreateTicketOrderDto,
  ): Promise<CreateTicketOrderResponseDto> {
    return await this.salesService.createTicketOrder(createTicketOrderDto);
  }

  @ApiBearerAuth('access_token')
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

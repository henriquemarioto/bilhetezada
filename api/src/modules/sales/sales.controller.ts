import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { CreateTicketOrderResponseDto } from './dtos/create-ticket-order-response.dto';
import { CreateTicketOrderDto } from './dtos/create-ticket-order.dto';
import { SalesService } from './services/sales.service';
import { CreateTicketOrderUseCase } from './use-cases/create-ticket-order.use-case';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly createTicketOrderUseCase: CreateTicketOrderUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'Generate order and return payment data',
    type: CreateTicketOrderResponseDto,
  })
  @Post('create-ticket-order')
  async createTicketOrder(
    @Body() createTicketOrderDto: CreateTicketOrderDto,
  ): Promise<CreateTicketOrderResponseDto> {
    return await this.createTicketOrderUseCase.execute(createTicketOrderDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-event-orders')
  async getEventOrders(@Query('eventId') eventId: string) {
    const orders = await this.salesService.getEventOrders(eventId);
    return {
      totalValue: orders.reduce(
        (acc, order) => acc + Number(order.total_amount),
        0,
      ),
      orders,
    };
  }
}

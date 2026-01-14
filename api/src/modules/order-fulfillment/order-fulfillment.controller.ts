import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { FindSaleTicketsUseCase } from './use-cases/find-sale-tickets.usecase';

@Controller('order')
export class OrderFulfillmentController {
  constructor(
    private readonly findSaleTicketsUseCase: FindSaleTicketsUseCase,
  ) {}

  @ApiResponse({
    description: 'Get tickets by order ID',
    type: '',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':orderId/tickets')
  async getTicketsByOrderId(@Param('orderId') orderId: string) {
    const tickets = await this.findSaleTicketsUseCase.execute(orderId);

    return tickets;
  }
}

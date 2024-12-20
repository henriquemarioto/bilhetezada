import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { SalesService } from '../sales.service';

@Controller()
export class CreateOrderController {
  constructor(private readonly salesService: SalesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create-order')
  async handle(@Body() createOrderDto: CreateOrderDto) {
    await this.salesService.createOrder(createOrderDto);
  }
}

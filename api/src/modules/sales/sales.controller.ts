import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { SalesService } from './sales.service';

@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    await this.salesService.createOrder(createOrderDto);
  }
}

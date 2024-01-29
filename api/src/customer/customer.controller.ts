import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthenticatedGuard } from 'src/auth/utils/Guards/authenticated.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('')
  findAll() {
    return this.customerService.findAll();
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  disable(@Param('id') id: string) {
    return this.customerService.disable(id);
  }
}

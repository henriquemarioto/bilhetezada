import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { RequestUser } from '../shared/dto/request-user.dto';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('update-customer')
  async update(
    @CurrentUser() user: RequestUser,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.customerService.update(user.userId, updateCustomerDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete-customer')
  async delete(@CurrentUser() user: RequestUser) {
    await this.customerService.disable(user.userId);
  }
}

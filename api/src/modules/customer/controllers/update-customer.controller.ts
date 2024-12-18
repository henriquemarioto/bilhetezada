import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt.guard';
import { RequestUser } from '../../shared/dto/request-user.dto';
import { CustomerService } from '../customer.service';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Controller('update-customer')
export class UpdateCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  handle(
    @CurrentUser() user: RequestUser,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    this.customerService.update(user.userId, updateCustomerDto);
  }
}

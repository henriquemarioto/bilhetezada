import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { CustomerService } from '../customer.service';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateCustomerDTO } from '../dto/update-customer.dto';
import { RequestUser } from 'src/shared/dto/request-user.dto';

@Controller('update-customer')
export class UpdateCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  handle(
    @CurrentUser() user: RequestUser,
    @Body() updateCustomerDto: UpdateCustomerDTO,
  ) {
    this.customerService.update(user.userId, updateCustomerDto);
  }
}

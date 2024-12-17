import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { RequestUser } from 'src/modules/shared/dto/request-user.dto';
import { CustomerService } from '../customer.service';
import { UpdateCustomerDTO } from '../dto/update-customer.dto';

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

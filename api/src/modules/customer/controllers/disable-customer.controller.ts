import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { RequestUser } from 'src/modules/shared/dto/request-user.dto';
import { CustomerService } from '../customer.service';

@Controller('delete-customer')
export class DisableCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async handle(@CurrentUser() user: RequestUser) {
    await this.customerService.disable(user.userId);
  }
}

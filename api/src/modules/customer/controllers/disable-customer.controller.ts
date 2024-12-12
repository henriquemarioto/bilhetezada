import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { AuthenticatedGuard } from 'src/modules/auth/utils/guards/authenticated.guard';
import { CustomerService } from '../customer.service';
import { Customer } from 'src/database/typeorm/entities/customer.entity';

@Controller('delete-customer')
export class DisableCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async handle(@CurrentUser() user: Customer) {
    await this.customerService.disable(user.id);
  }
}

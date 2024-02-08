import { Controller, Delete, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/guards/authenticated.guard';
import { CustomerService } from '../customer.service';
import { CurrentUser } from 'src/auth/utils/current-user-decorator';
import { Customer } from '../entities/customer.entity';

@Controller('customer')
export class DisableCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  disable(@CurrentUser() user: Customer) {
    return this.customerService.disable(user['_id']);
  }
}

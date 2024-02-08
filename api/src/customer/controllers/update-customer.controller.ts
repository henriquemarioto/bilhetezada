import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/guards/authenticated.guard';
import { CustomerService } from '../customer.service';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CurrentUser } from 'src/auth/utils/current-user-decorator';
import { Customer } from '../entities/customer.entity';

@Controller('customer')
export class UpdateCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthenticatedGuard)
  @Patch()
  update(
    @CurrentUser() user: Customer,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(user['_id'], updateCustomerDto);
  }
}

import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { AuthenticatedGuard } from 'src/modules/auth/utils/guards/authenticated.guard';
import { CustomerService } from '../customer.service';
import { CreateCustomerPartialDTO } from '../dto/create-customer.dto';
import { Customer } from 'src/database/typeorm/entities/customer.entity';

@Controller('update-customer')
export class UpdateCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthenticatedGuard)
  @Patch()
  handle(
    @CurrentUser() user: Customer,
    @Body() updateCustomerDto: CreateCustomerPartialDTO,
  ) {
    return this.customerService.update(user.id, updateCustomerDto);
  }
}

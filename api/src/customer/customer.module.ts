import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerService } from './customer.service';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { DisableCustomerController } from './controllers/disable-customer.controller';
import { UpdateCustomerController } from './controllers/update-customer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [DisableCustomerController, UpdateCustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}

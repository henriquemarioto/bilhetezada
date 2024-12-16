import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from 'src/database/typeorm/entities/customer.entity';
import { DisableCustomerController } from './controllers/disable-customer.controller';
import { UpdateCustomerController } from './controllers/update-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), forwardRef(() => AuthModule)],
  controllers: [DisableCustomerController, UpdateCustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}

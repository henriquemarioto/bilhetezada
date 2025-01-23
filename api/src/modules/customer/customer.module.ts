import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from '@/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from './customer.controller';
import SharedModule from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => AuthModule),
    SharedModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}

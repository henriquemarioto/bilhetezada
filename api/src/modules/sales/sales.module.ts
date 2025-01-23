import { Buyer } from '@/entities/buyer.entity';
import { Order } from '@/entities/order.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { EventModule } from '../event/event.module';
import SharedModule from '../shared/shared.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Buyer]),
    EventModule,
    CustomerModule,
    AuthModule,
    SharedModule,
  ],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}

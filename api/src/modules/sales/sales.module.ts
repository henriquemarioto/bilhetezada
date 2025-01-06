import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from 'src/database/typeorm/entities/buyer.entity';
import { Order } from 'src/database/typeorm/entities/order.entity';
import { Payment } from 'src/database/typeorm/entities/payment.entity';
import { EventModule } from '../event/event.module';
import { SalesController } from './sales.controller';
import { CustomerModule } from '../customer/customer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Buyer, Payment]),
    EventModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}

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
import { Ticket } from 'src/database/typeorm/entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Buyer, Payment, Ticket]),
    EventModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}

import { Buyer } from '@/entities/buyer.entity';
import { Order } from '@/entities/order.entity';
import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { EventModule } from '../event/event.module';
import SharedModule from '../shared/shared.module';
import { OpenPixController } from './controllers/openpix.controller';
import { SalesController } from './controllers/sales.controller';
import { OpenPixService } from './services/openpix.service';
import { SalesService } from './services/sales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Buyer, Payment, Ticket]),
    EventModule,
    CustomerModule,
    AuthModule,
    SharedModule,
  ],
  providers: [SalesService, OpenPixService],
  controllers: [SalesController, OpenPixController],
})
export class SalesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from 'src/database/typeorm/entities/buyer.entity';
import { Order } from 'src/database/typeorm/entities/order.entity';
import { Payment } from 'src/database/typeorm/entities/payment.entity';
import { Ticket } from 'src/database/typeorm/entities/ticket.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { EventModule } from '../event/event.module';
import SharedModule from '../shared/shared.module';
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
  controllers: [SalesController],
})
export class SalesModule {}

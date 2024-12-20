import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from 'src/database/typeorm/entities/buyer.entity';
import { Order } from 'src/database/typeorm/entities/order.entity';
import { Payment } from 'src/database/typeorm/entities/payment.entity';
import { CreateOrderController } from './controllers/create-order.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Buyer, Payment]), EventModule],
  providers: [SalesService],
  controllers: [CreateOrderController],
})
export class SalesModule {}

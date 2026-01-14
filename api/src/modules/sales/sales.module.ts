import { Order } from '@/modules/sales/entities/order.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../event/event.module';
import { PaymentModule } from '../payment/payment.module';
import SharedModule from '../shared/shared.module';
import { TicketModule } from '../ticket/ticket.module';
import { UserModule } from '../user/user.module';
import { Buyer } from './entities/buyer.entity';
import { OrderItem } from './entities/order-item.entity';
import { OnPaymentConfirmedListener } from './listeners/on-payment-approved.listener';
import { BuyerRepository } from './repositories/buyer.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderRepository } from './repositories/order.repository';
import { SalesController } from './sales.controller';
import { SalesService } from './services/sales.service';
import { CreateBuyerUseCase } from './use-cases/create-buyer.use-case';
import { CreateTicketOrderUseCase } from './use-cases/create-ticket-order.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Buyer, OrderItem]),
    EventModule,
    UserModule,
    AuthModule,
    SharedModule,
    forwardRef(() => PaymentModule),
    EventModule,
  ],
  providers: [
    SalesService,
    OrderRepository,
    OrderItemRepository,
    BuyerRepository,
    CreateBuyerUseCase,
    CreateTicketOrderUseCase,
    OnPaymentConfirmedListener,
  ],
  controllers: [SalesController],
  exports: [SalesService, OrderItemRepository],
})
export class SalesModule {}

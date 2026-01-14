import { Module } from '@nestjs/common';
import { OnPaymentConfirmedListener } from './listeners/on-payment-approved.listener';
import { FindSaleTicketsUseCase } from './use-cases/find-sale-tickets.usecase';
import { GenerateTicketsOnPaymentConfirmedUseCase } from './use-cases/generate-tickets-on-payment-confirmed.use-case';
import { TicketModule } from '../ticket/ticket.module';
import { SalesModule } from '../sales/sales.module';
import { EventModule } from '../event/event.module';
import { OrderFulfillmentController } from './order-fulfillment.controller';

@Module({
  imports: [TicketModule, SalesModule, EventModule],
  controllers: [OrderFulfillmentController],
  providers: [
    FindSaleTicketsUseCase,
    GenerateTicketsOnPaymentConfirmedUseCase,
    OnPaymentConfirmedListener,
  ],
  exports: [FindSaleTicketsUseCase, GenerateTicketsOnPaymentConfirmedUseCase],
})
export class OrderFulfillmentModule {}

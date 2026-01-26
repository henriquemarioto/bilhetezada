import { Module } from '@nestjs/common';
import { OnPaymentApprovedListener } from './listeners/on-payment-approved.listener';
import { FindSaleTicketsUseCase } from './use-cases/find-sale-tickets.usecase';
import { GenerateTicketsOnPaymentApprovedUseCase } from './use-cases/generate-tickets-on-payment-approved.use-case';
import { TicketModule } from '../ticket/ticket.module';
import { SalesModule } from '../sales/sales.module';
import { EventModule } from '../event/event.module';
import { OrderFulfillmentController } from './order-fulfillment.controller';
import SharedModule from '../shared/shared.module';

@Module({
  imports: [TicketModule, SalesModule, EventModule, SharedModule],
  controllers: [OrderFulfillmentController],
  providers: [
    FindSaleTicketsUseCase,
    GenerateTicketsOnPaymentApprovedUseCase,
    OnPaymentApprovedListener,
  ],
  exports: [FindSaleTicketsUseCase, GenerateTicketsOnPaymentApprovedUseCase],
})
export class OrderFulfillmentModule {}

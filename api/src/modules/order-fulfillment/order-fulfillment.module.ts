import { EventFailureModule } from '@/infrastructure/observability/event-failure/event-failure.module';
import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { SalesModule } from '../sales/sales.module';
import SharedModule from '../shared/shared.module';
import { TicketModule } from '../ticket/ticket.module';
import { OnPaymentApprovedListener } from './listeners/on-payment-approved.listener';
import { OrderFulfillmentController } from './order-fulfillment.controller';
import { FindSaleTicketsUseCase } from './use-cases/find-sale-tickets.usecase';
import { GenerateTicketsOnPaymentApprovedUseCase } from './use-cases/generate-tickets-on-payment-approved.use-case';

@Module({
  imports: [TicketModule, SalesModule, EventModule, SharedModule, EventFailureModule],
  controllers: [OrderFulfillmentController],
  providers: [
    FindSaleTicketsUseCase,
    GenerateTicketsOnPaymentApprovedUseCase,
    OnPaymentApprovedListener,
  ],
  exports: [FindSaleTicketsUseCase, GenerateTicketsOnPaymentApprovedUseCase],
})
export class OrderFulfillmentModule {}

import { Order } from '@/entities/order.entity';
import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { PaymentController } from './payment.controller';
import { OpenPixService } from './services/openpix.service';
import { OpenPixWebhookService } from './webhooks/openpix.webhook.service';
import { WebhookFactory } from './webhooks/webhook.factory';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order, Ticket, Payment]),
    SharedModule,
    NotificationModule,
  ],
  controllers: [PaymentController],
  providers: [
    { provide: 'PaymentService', useClass: OpenPixService },
    WebhookFactory,
    OpenPixWebhookService,
  ],
  exports: ['PaymentService'],
})
export class PaymentModule {}

import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedModule from '../shared/shared.module';
import { WooviAdapter } from './adapters/woovi.adapter';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './services/payment.service';
import { SalesModule } from '../sales/sales.module';
import { CreatePaymentUseCase } from './use-cases/create-payment.use-case';
import { PaymentRepository } from './repositories/payment.repository';
import { WebhookProcessorService } from './webhooks/webhook-processor.service';
import { WooviWebhookAdapter } from './webhooks/adapters/woovi.webhook.adapter';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Payment]),
    SharedModule,
    forwardRef(() => SalesModule),
  ],
  controllers: [PaymentController],
  providers: [
    { provide: 'PaymentProcessor', useClass: WooviAdapter },
    PaymentService,
    WooviWebhookAdapter,
    WebhookProcessorService,
    CreatePaymentUseCase,
    PaymentRepository,
  ],
  exports: ['PaymentProcessor', PaymentService],
})
export class PaymentModule {}

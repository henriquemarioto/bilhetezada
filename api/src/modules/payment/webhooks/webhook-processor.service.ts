import { SalesService } from '@/modules/sales/services/sales.service';
import { PaymentMethods } from '@/shared/enums/payment-methods.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { Injectable } from '@nestjs/common';  
import { PaymentApprovedEvent } from '../domain-events/payment-approved.event';
import { CreatePaymentUseCase } from '../use-cases/create-payment.use-case';
import { PaymentWebhookAdapterInterface } from './interfaces/payment-wehook.adapter.interface';
import { EventEmitterService } from '@/modules/shared/services/event-emitter.service';

@Injectable()
export class WebhookProcessorService {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly salesService: SalesService,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async process(
    adapter: PaymentWebhookAdapterInterface,
    headers: any,
    payload: any,
  ) {
    const signatureValidated = await adapter.validateSignature(
      headers,
      payload,
    );

    if (signatureValidated === false) {
      console.error(
        'Invalid webhook signature',
        JSON.stringify({ headers, payload }),
      );
      throw new Error('Invalid webhook signature');
    }

    const data = await adapter.parse(payload);

    const order = await this.salesService.getOrderByTransactionReference(
      data.externalId,
    );

    if (!order) {
      console.error(
        'Order not found for webhook processing',
        JSON.stringify(data),
      );

      throw new Error('Order not found for webhook processing');
    }

    const payment = await this.createPaymentUseCase.execute({
      method: PaymentMethods.PIX,
      transaction_reference: data.externalId,
      status: data.status,
      orderId: order.id,
      value: data.amount,
      description: `Ticket payment ${data.status} from ${data.gateway}`,
      gateway: data.gateway,
    });

    if (data.status === PaymentStatus.APPROVED) {
      this.eventEmitterService.emitAsync(
        'payment.approved',
        new PaymentApprovedEvent(order.id, payment.id),
      );
    }
  }
}

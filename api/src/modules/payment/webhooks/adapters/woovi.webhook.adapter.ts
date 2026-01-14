import { PaymentGateways } from '@/shared/enums/payment-gateways.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import WooviChargeStatus from '@/shared/enums/woovi-charge-status.enum';
import { Injectable } from '@nestjs/common';
import { WooviWebhookBodyDto } from '../../dtos/woovi-pix-webhook-body.dto';
import { PaymentWebhookAdapterInterface } from '../interfaces/payment-wehook.adapter.interface';

const WooviChargeStatusToPaymentStatus = {
  [WooviChargeStatus.COMPLETED]: PaymentStatus.APPROVED,
  [WooviChargeStatus.EXPIRED]: PaymentStatus.CANCELLED,
};

@Injectable()
export class WooviWebhookAdapter implements PaymentWebhookAdapterInterface {
  constructor() {}

  async validateSignature(headers, payload) {
    return true;
  }

  async parse(payload: WooviWebhookBodyDto) {
    return {
      externalId: payload.charge.correlationID,
      status: WooviChargeStatusToPaymentStatus[payload.charge.status],
      gateway: PaymentGateways.WOOVI,
      amount: payload.charge.value,
      raw: payload,
    };
  }
}

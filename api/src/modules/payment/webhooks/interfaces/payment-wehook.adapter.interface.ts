import { PaymentGateways } from '@/shared/enums/payment-gateways.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';

export interface PaymentWebhookAdapterInterface {
  validateSignature(headers: any, payload: any): Promise<boolean>;
  parse(payload: any): Promise<ParsedPaymentWebhook>;
}

export type ParsedPaymentWebhook = {
  externalId: string;
  gateway: PaymentGateways;
  status: PaymentStatus;
  amount: number;
  raw: any;
};

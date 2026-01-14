import { PaymentGateways } from '@/shared/enums/payment-gateways.enum';
import { PaymentMethods } from '@/shared/enums/payment-methods.enum';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';

export class CreatePaymentDto {
  method: PaymentMethods;
  value: number;
  transaction_reference: string;
  status: PaymentStatus;
  description: string;
  orderId: string;
  gateway: PaymentGateways;
}

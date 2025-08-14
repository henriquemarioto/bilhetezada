import { PaymentMethods } from '@/modules/shared/enums/payment-methods.enum';

export interface PaymentService {
  generateCharge(
    amount: number,
    type?: PaymentMethods,
    currency?: string,
  ): Promise<{
    transactionId: string;
    qrcodeImageUrl: string;
    pixCopyPaste: string;
    value: number;
    expiresDate: string;
  }>;
  getPaymentStatus(transactionId: string): Promise<string>;
}

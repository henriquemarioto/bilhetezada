import { PaymentMethods } from '@/shared/enums/payment-methods.enum';

export interface PaymentProcessor {
  apiBaseUrl: string;
  apiKey: string;
  defaultChargeExpirationSeconds: number;

  calculateGatewayFee(amount: number): { feeAmount: number; feeRule: string };
  generateCharge(params: {
    amount: number;
    splitDetails: { pixKey: string; amount: number }[];
    description: string;
    buyerInfo?: { name: string; phone?: string; email?: string };
    additionalInfo?: { key: string; value: any }[];
    expiresInSeconds?: number;
    type?: PaymentMethods;
    currency?: string;
  }): Promise<{
    transactionId: string;
    qrcodeImageUrl: string;
    pixCopyPaste: string;
    value: number;
    checkoutUrl: string;
    expiresDate: string;
  }>;
  getPaymentStatus(transactionId: string): Promise<string>;
  getBalance(id: string): Promise<number>;
  withdraw(id: string, value: number): Promise<boolean>;
  registerSplit?(
    pixKey: string,
    name: string,
    document: string,
  ): Promise<boolean>;
}

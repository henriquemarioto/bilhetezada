import { Inject, Injectable } from '@nestjs/common';
import { PaymentProcessor } from '../interfaces/payment-processor.interface';

export interface FeeCalculationResult {
  feeAmount: number;
  feeRule: string;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentProcessor')
    private paymentProcessor: PaymentProcessor,
  ) {}

  calculatePlatformFee(amount: number): FeeCalculationResult {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!Number.isInteger(amount)) {
      throw new Error('Amount must be an integer (in cents)');
    }

    let feeAmount: number;
    let feeRule: string;

    if (amount <= 1000) {
      feeAmount = 50;
      feeRule = 'Fixed fee R$ 0.50 (up to R$ 10.00)';
    } else if (amount <= 3000) {
      feeAmount = 100;
      feeRule = 'Fixed fee R$ 1.00 (R$ 10.01 to R$ 30.00)';
    } else if (amount <= 10000) {
      feeAmount = Math.round(amount * 0.05);
      feeRule = '5% of ticket value (R$ 30.01 to R$ 100.00)';
    } else {
      feeAmount = 500 + Math.round(amount * 0.02);
      feeRule = 'R$ 5.00 + 2% of total value (above R$ 100.00)';
    }

    return {
      feeAmount,
      feeRule,
    };
  }

  calculateTotalFee(amount: number): {
    gatewayFeeAmount: number;
    gatewayFeeRule: string;
    platformFeeAmount: number;
    platformFeeRule: string;
  } {
    const platformFeeData = this.calculatePlatformFee(amount);

    const gatewayFee = this.paymentProcessor.calculateGatewayFee(amount);

    return {
      gatewayFeeAmount: gatewayFee.feeAmount,
      gatewayFeeRule: gatewayFee.feeRule,
      platformFeeAmount: platformFeeData.feeAmount,
      platformFeeRule: platformFeeData.feeRule,
    };
  }
}

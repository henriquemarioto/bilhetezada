import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class CreatePaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentRepository.createPayment(createPaymentDto);
  }
}

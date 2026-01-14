import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';

@Injectable()
export class PaymentRepository extends TypeOrmBaseRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    super(paymentRepository);
  }

  async createPayment(data: CreatePaymentDto): Promise<Payment> {
    return this.createImplementation(data);
  }

  async findOneById(paymentId: string): Promise<Payment | null> {
    return this.findOneImplementation({
      where: { id: paymentId },
    });
  }

  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
  ): Promise<Payment> {
    const result = await this.updateImplementation(paymentId, { status });
    return result.raw;
  }
}

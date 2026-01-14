import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Buyer } from '../entities/buyer.entity';
import { CreateBuyerDto } from '../dtos/create-buyer.dto';

@Injectable()
export class BuyerRepository extends TypeOrmBaseRepository<Buyer> {
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
  ) {
    super(buyerRepository);
  }

  async createBuyer(data: CreateBuyerDto): Promise<Buyer> {
    return this.createImplementation(data);
  }

  async getBuyerByOrderId(orderId: string): Promise<Buyer | null> {
    return this.findOne({
      where: {
        order_id: orderId,
      },
    });
  }
}

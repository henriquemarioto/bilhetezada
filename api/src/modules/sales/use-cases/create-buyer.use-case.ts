import { Injectable } from '@nestjs/common';
import { BuyerRepository } from '../repositories/buyer.repository';
import { CreateBuyerDto } from '../dtos/create-buyer.dto';
import { Buyer } from '../entities/buyer.entity';

@Injectable()
export class CreateBuyerUseCase {
  constructor(private buyersRepository: BuyerRepository) {}

  async execute(createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.buyersRepository.createBuyer(createBuyerDto);
  }
}

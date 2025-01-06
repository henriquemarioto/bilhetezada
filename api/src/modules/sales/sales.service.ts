import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from 'src/database/typeorm/entities/buyer.entity';
import { Order } from 'src/database/typeorm/entities/order.entity';
import { Payment } from 'src/database/typeorm/entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventService } from '../event/event.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Buyer)
    private buyersRepository: Repository<Buyer>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private eventService: EventService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const event = await this.eventService.getById(createOrderDto.eventId);

    const buyer = await this.buyersRepository.save(createOrderDto.buyer);

    createOrderDto.eventId = undefined;

    await this.ordersRepository.save({
      ...createOrderDto,
      event,
      buyer,
    });

    return true;
  }

  async getEventOrders(eventId: string, userId: string) {
    await this.eventService.getById(eventId, userId);

    const orders = await this.ordersRepository.find({
      where: {
        event: {
          id: eventId,
        },
      },
    });

    if (!orders.length) throw new NotFoundException();

    return orders;
  }
}

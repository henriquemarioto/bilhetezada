import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { Order } from '../entities/order.entity';
import { Event } from '@/modules/event/entities/event.entity';
import { OrderStatus } from '@/shared/enums/order-status.enum';

export type CreateOrderData = {
  totalAmount: number;
  platformFeeAmount: number;
  gatewayFeeAmount: number;
  eventOrganizerAmountNet: number;
  event: Event;
  ticketQuantity: number;
  transactionReference: string;
};

@Injectable()
export class OrderRepository extends TypeOrmBaseRepository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    return this.createImplementation({
      total_amount: data.totalAmount,
      platform_fee_amount: data.platformFeeAmount,
      gateway_fee_amount: data.gatewayFeeAmount,
      event_organizer_amount_net: data.eventOrganizerAmountNet,
      ticket_quantity: data.ticketQuantity,
      transaction_reference: data.transactionReference,
      event: data.event,
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async getOrdersByEventId(eventId: string): Promise<Order[]> {
    return this.findAll({
      where: {
        event_id: eventId,
      },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.orderRepository.update(orderId, { status });
  }
}

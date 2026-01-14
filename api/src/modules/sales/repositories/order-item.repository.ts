import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmBaseRepository } from '@/core/common/typeorm.base.repository';
import { OrderItem } from '../entities/order-item.entity';

export type CreateOrderItemData = {
  orderId: string;
  batchId: string;
  ticketQuantity: number;
  totalAmount: number;
};

@Injectable()
export class OrderItemRepository extends TypeOrmBaseRepository<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {
    super(orderItemRepository);
  }

  async createOrderItem(data: CreateOrderItemData): Promise<OrderItem> {
    return this.createImplementation({
      order_id: data.orderId,
      batch_id: data.batchId,
      ticket_quantity: data.ticketQuantity,
      total_amount: data.totalAmount,
    });
  }

  async findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.findAllImplementation({
      where: {
        order_id: orderId,
      },
    });
  }
}

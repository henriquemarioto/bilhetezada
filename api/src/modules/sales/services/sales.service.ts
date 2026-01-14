import { Order } from '@/modules/sales/entities/order.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@/shared/enums/order-status.enum';
import {
  CreateOrderData,
  OrderRepository,
} from '../repositories/order.repository';
import { BuyerRepository } from '../repositories/buyer.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';

@Injectable()
export class SalesService {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    private buyerRepository: BuyerRepository,
  ) {}

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    return this.orderRepository.createOrder(orderData);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepository.getOrderById(orderId);
  }

  async getOrderByTransactionReference(
    transactionReference: string,
  ): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        transaction_reference: transactionReference,
      },
    });
  }

  async getOrderItemsByOrderId(orderId: string) {
    return this.orderItemRepository.findOrderItemsByOrderId(orderId);
  }

  async getEventOrders(eventId: string): Promise<Order[]> {
    const orders = await this.orderRepository.getOrdersByEventId(eventId);

    if (!orders.length) throw new NotFoundException();

    return orders;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === status) {
      return;
    }

    await this.orderRepository.updateOrderStatus(orderId, status);
  }

  async getBuyerByOrderId(orderId: string) {
    const buyer = await this.buyerRepository.getBuyerByOrderId(orderId);

    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    return buyer;
  }
}

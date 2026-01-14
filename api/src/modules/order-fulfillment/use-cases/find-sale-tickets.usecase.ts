import { TicketRepository } from '@/modules/ticket/repositories/ticket.repository';
import { Injectable } from '@nestjs/common';
import { OrderItemRepository } from '../../sales/repositories/order-item.repository';

@Injectable()
export class FindSaleTicketsUseCase {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(orderId: string) {
    const orderItems =
      await this.orderItemRepository.findOrderItemsByOrderId(orderId);

    const orderItemsIds = orderItems.map((item) => item.id);

    const tickets =
      await this.ticketRepository.findByOrderItemIds(orderItemsIds);

    return tickets;
  }
}

import { TicketsCreatedEvent } from '@/modules/order-fulfillment/domain-events/tickets-created.event';
import { SalesService } from '@/modules/sales/services/sales.service';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';

@Injectable()
export class NotifyCreatedTicketsUseCase {
  constructor(
    private readonly salesService: SalesService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(data: TicketsCreatedEvent): Promise<void> {
    const buyer = await this.salesService.getBuyerByOrderId(data.orderId);

    if (!buyer) {
      console.error(
        `Buyer not found for notify created tickets, orderId: ${data.orderId}`,
      );
      throw new Error(
        `Buyer not found to notify created tickets, orderId: ${data.orderId}`,
      );
    }

    if (!buyer.phone) {
      console.error(
        `Buyer phone not found for notify created tickets, orderId: ${data.orderId}, buyerId: ${buyer.id}`,
      );
      throw new Error(
        `Buyer phone not found to notify created tickets, orderId: ${data.orderId}, buyerId: ${buyer.id}`,
      );
    }

    await this.notificationService.send({
      channel: NotificationChannel.WHATSAPP,
      to: buyer.phone,
      data: {
        bodyText: `Seus ingressos para o evento ${data.eventName} ja estão disponíveis! Acesse o botão abaixo para visualizá-los e aproveite o evento!`,
        footerText: 'Acesse no botão abaixo.',
        buttonUrl: 'https://bilhetezada.com/meus-ingressos',
        buttonLabel: 'Ver Ingressos',
      },
    });
  }
}

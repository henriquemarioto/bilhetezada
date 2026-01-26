import { TicketsCreatedEvent } from '@/modules/order-fulfillment/domain-events/tickets-created.event';
import { NotificationChannel } from '@/shared/enums/notification-channel.enum';
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';

@Injectable()
export class NotifyCreatedTicketsUseCase {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  async execute(data: TicketsCreatedEvent): Promise<void> {
    if (!data.buyerPhone) {
      console.error(
        `Buyer phone not provided for notify created tickets, orderId: ${data.orderId}, buyer phone: ${data.buyerPhone}`,
      );
      throw new Error(
        `Buyer phone not provided to notify created tickets, orderId: ${data.orderId}, buyer phone: ${data.buyerPhone}`,
      );
    }

    await this.notificationService.send({
      channel: NotificationChannel.WHATSAPP,
      to: data.buyerPhone,
      data: {
        bodyText: `Seus ingressos para o evento ${data.eventName} ja estão disponíveis! Acesse o botão abaixo para visualizá-los e aproveite o evento!`,
        footerText: 'Acesse no botão abaixo.',
        buttonUrl: 'https://bilhetezada.com/meus-ingressos',
        buttonLabel: 'Ver Ingressos',
      },
    });
  }
}

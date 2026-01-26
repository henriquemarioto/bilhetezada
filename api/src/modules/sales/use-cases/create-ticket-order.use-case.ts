import { EventService } from '@/modules/event/services/event.service';
import { PaymentProcessor } from '@/modules/payment/interfaces/payment-processor.interface';
import { PaymentService } from '@/modules/payment/services/payment.service';
import { BatchService } from '@/modules/ticket/services/batch.service';
import { UserService } from '@/modules/user/services/user.service';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTicketOrderDto } from '../dtos/create-ticket-order.dto';
import { OrderRepository } from '../repositories/order.repository';
import { CreateBuyerUseCase } from './create-buyer.use-case';

@Injectable()
export class CreateTicketOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private createBuyerUseCase: CreateBuyerUseCase,
    private eventService: EventService,
    private userService: UserService,
    private batchService: BatchService,
    @Inject('PaymentProcessor')
    private paymentProcessor: PaymentProcessor,
    private paymentService: PaymentService,
  ) {}

  async execute(createTicketOrderDto: CreateTicketOrderDto): Promise<{
    transactionId: string;
    qrcodeImageUrl: string;
    pixCopyPaste: string;
    checkoutUrl: string;
    value: number;
    expiresDate: string;
  }> {
    const event = await this.eventService.getById(createTicketOrderDto.eventId);

    if (!event) {
      throw new ForbiddenException('Event not found');
    }

    const batch = await this.batchService.getById(createTicketOrderDto.batchId);

    if (!batch || batch.event_id !== event.id) {
      throw new ForbiddenException('Ticket Batch not found for this event');
    }

    if (new Date(batch.end_at) < new Date()) {
      throw new ForbiddenException(
        'Ticket purchase for this ticket batch time expired',
      );
    }

    const organizerUser = await this.userService.getById(
      event.organizer_user_id,
    );

    if (!organizerUser) {
      throw new ForbiddenException('Organizer of this event not found');
    }

    if (!organizerUser.pix_key) {
      throw new ForbiddenException(
        'Organizer of this event has no pix key configured',
      );
    }

    const buyer = await this.createBuyerUseCase.execute(
      createTicketOrderDto.buyer,
    );

    const totalAmount = batch.amount * createTicketOrderDto.ticketQuantity;

    const amountDetails = this.paymentService.calculateTotalFee(totalAmount);

    const organizerAmount =
      totalAmount -
      amountDetails.platformFeeAmount -
      amountDetails.gatewayFeeAmount;

    const charge = await this.paymentProcessor.generateCharge({
      amount: totalAmount,
      description: `Compra de ${createTicketOrderDto.ticketQuantity} ingresso(s) para o evento ${event.name}, lote ${batch.name}`,
      buyerInfo: {
        name: buyer.name,
        phone: buyer.phone,
      },
      additionalInfo: [
        {
          key: 'Nome do evento',
          value: event.name,
        },
        {
          key: 'Quantidade de ingressos',
          value: createTicketOrderDto.ticketQuantity,
        },
        {
          key: 'Local do evento',
          value: event.place_name,
        },
        {
          key: 'Data do evento',
          value: new Date(event.start_at).toLocaleDateString('pt-BR', {
            timeZone: event.time_zone,
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
      splitDetails: [
        {
          amount: organizerAmount,
          pixKey: organizerUser.pix_key,
        },
      ],
    });

    await this.orderRepository.createOrder({
      ticketQuantity: createTicketOrderDto.ticketQuantity,
      totalAmount: totalAmount,
      platformFeeAmount: amountDetails.platformFeeAmount,
      gatewayFeeAmount: amountDetails.gatewayFeeAmount,
      eventOrganizerAmountNet: organizerAmount,
      transactionReference: charge.transactionId,
      event,
    });

    return {
      transactionId: charge.transactionId,
      qrcodeImageUrl: charge.qrcodeImageUrl,
      pixCopyPaste: charge.pixCopyPaste,
      value: charge.value,
      checkoutUrl: charge.checkoutUrl,
      expiresDate: charge.expiresDate,
    };
  }
}

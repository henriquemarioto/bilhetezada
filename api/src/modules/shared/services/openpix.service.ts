import { Order } from '@/entities/order.entity';
import { Payment } from '@/entities/payment.entity';
import { Ticket } from '@/entities/ticket.entity';
import { OrderStatus } from '@/modules/shared/enums/order-status.enum';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { OpenPixChargeResponseDto } from '../../sales/dto/openpix-charge-response.dto';
import { OpenPixPixWebhookBodyDto } from '../../sales/dto/openpix-pix-webhook-body.dto';
import OpenPixChargeStatus from '../enums/openpix-charge-status.enum';
import { PaymentMethods } from '../enums/payment-methods.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { HttpService } from './http.service';

@Injectable()
export class OpenPixService {
  private readonly apiBaseUrl: string;
  private readonly appId: string;
  private readonly headers: {
    Authorization: string;
    'Content-Type': string;
  };

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {
    this.apiBaseUrl = configService.get('openPixApiUrl');
    this.appId = configService.get('openPixAppId');
    this.headers = {
      Authorization: this.appId,
      'Content-Type': 'application/json',
    };
  }

  async generatePixCharge(value: number): Promise<OpenPixChargeResponseDto> {
    const url = this.apiBaseUrl + '/charge';
    const chargeResult = (await this.httpService.post(url, {
      headers: this.headers,
      body: {
        value: value,
        correlationID: randomUUID(),
      },
    })) as OpenPixChargeResponseDto | false;

    if (chargeResult === false) {
      console.error('Error generating pix charge', {
        url: url,
        value,
      });

      throw new InternalServerErrorException(
        'Error generating pix payment with external provider',
      );
    }

    return chargeResult;
  }

  async webhookPix(body: OpenPixPixWebhookBodyDto): Promise<boolean> {
    if (body.charge.status === OpenPixChargeStatus.COMPLETED) {
      const order = await this.ordersRepository.findOne({
        where: {
          transaction_reference: body.charge.correlationID,
        },
        relations: {
          event: true,
        },
      });

      await this.paymentsRepository.save({
        method: PaymentMethods.PIX,
        transaction_reference: body.charge.correlationID,
        status: PaymentStatus.PAID,
        order: order,
        value: body.pix.value / 100,
      });

      await this.ordersRepository.update(order.id, {
        status: OrderStatus.CONFIRMED,
      });

      await this.ticketsRepository.save({
        event: order.event,
        order: order,
      });

      //Send ticket by email
    }
    return true;
  }
}

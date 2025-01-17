import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Order } from '../../../database/typeorm/entities/order.entity';
import { Payment } from '../../../database/typeorm/entities/payment.entity';
import { Ticket } from '../../../database/typeorm/entities/ticket.entity';
import { PaymentMethods } from '../../shared/enums/payment-methods.enum';
import { PaymentStatus } from '../../shared/enums/payment-status.enum';
import { HttpService } from '../../shared/services/http.service';
import { OpenPixChargeResponseDto } from '../dto/openpix-charge-response.dto';
import { PixWebhookBodyDto } from '../dto/openpix-webhook-body.dto';
import OpenPixWebhookStatus from '../../shared/enums/openpix-webhook-status.enum';
import { OrderStatus } from 'src/modules/shared/enums/orde-status.enum';

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

  async generatePixCharge(
    value: number,
  ): Promise<OpenPixChargeResponseDto | false> {
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
    }

    return chargeResult;
  }

  async webhookPix(body: PixWebhookBodyDto) {
    if (body.charge.status === OpenPixWebhookStatus.COMPLETED) {
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

      //Send ticker by email
    }
    return true;
  }
}

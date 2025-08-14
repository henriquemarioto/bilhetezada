import { BadRequestException, Injectable } from '@nestjs/common';
import { OpenPixWebhookService } from './openpix.webhook.service';
import { WebhookInterface } from './interfaces/webhook.interface';

@Injectable()
export class WebhookFactory {
  constructor(private readonly openpixWebhookService: OpenPixWebhookService) {}

  getService(
    body: any,
    headers?: Record<string, any> | undefined,
  ): WebhookInterface {
    if (body.charge && body.pix) return this.openpixWebhookService;
    throw new BadRequestException('Payment provider not identified');
  }
}

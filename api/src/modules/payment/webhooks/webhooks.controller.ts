import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { WebhookFactory } from './webhook.factory';

@Controller('webhook')
export class WebhooksController {
  constructor(private webhookFactory: WebhookFactory) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: any,
  ): Promise<void> {
    const webhookService = this.webhookFactory.getService(Headers, body);
  }
}

import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhookFactory } from './webhooks/webhook.factory';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class PaymentController {
  constructor(private readonly webhookFactory: WebhookFactory) {}

  @ApiExcludeEndpoint()
  @Post('webhook')
  async handleWebhook(
    @Headers() headers: Record<string, any>,
    @Body() body: any,
  ): Promise<boolean> {
    const service = this.webhookFactory.getService(body, headers);
    return service.handleWebhook(body);
  }
}

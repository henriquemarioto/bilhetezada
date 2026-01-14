import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { WooviWebhookBodyDto } from './dtos/woovi-pix-webhook-body.dto';
import { WebhookProcessorService } from './webhooks/webhook-processor.service';
import { WooviWebhookAdapter } from './webhooks/adapters/woovi.webhook.adapter';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly webhookProcessorService: WebhookProcessorService,
    private readonly wooviWebhookAdapter: WooviWebhookAdapter,
  ) {}

  @ApiExcludeEndpoint()
  @Post('webhook/woovi')
  async handleWebhookWoovi(
    @Headers() headers: Record<string, any>,
    @Body() body: WooviWebhookBodyDto,
  ): Promise<{ received: true }> {
    await this.webhookProcessorService.process(
      this.wooviWebhookAdapter,
      headers,
      body,
    );
    return { received: true };
  }
}

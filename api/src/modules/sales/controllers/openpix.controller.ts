import { OpenPixService } from './../services/openpix.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PixWebhookBodyDto } from '../dto/openpix-webhook-body.dto';

@Controller()
export class OpenPixController {
  constructor(private readonly openPixService: OpenPixService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('webhook/openpix/pix')
  async webhookPixPayment(@Body() body: PixWebhookBodyDto) {
    await this.openPixService.webhookPix(body);
    return true;
  }
}

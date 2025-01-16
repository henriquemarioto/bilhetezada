import { ApiProperty } from '@nestjs/swagger';
import OpenPixWebhookStatus from 'src/modules/shared/enums/openpix-webhook-status.enum';

class ChargeDto {
  @ApiProperty({ enum: OpenPixWebhookStatus })
  status: OpenPixWebhookStatus;

  @ApiProperty()
  customer?: unknown;

  @ApiProperty()
  correlationID: string;

  @ApiProperty()
  transactionID: string;

  @ApiProperty()
  brCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class PixDto {
  @ApiProperty({ type: 'null' })
  pixQrCode: null;

  @ApiProperty()
  charge: unknown;

  @ApiProperty()
  customer: unknown;

  @ApiProperty()
  payer: unknown;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  value: number;

  @ApiProperty()
  transactionID: string;

  @ApiProperty()
  infoPagador: string;

  @ApiProperty()
  raw: unknown;
}

export class PixWebhookBodyDto {
  @ApiProperty()
  charge: ChargeDto;

  @ApiProperty()
  pix: PixDto;

  @ApiProperty({ type: 'null' })
  pixQrCode: null;
}

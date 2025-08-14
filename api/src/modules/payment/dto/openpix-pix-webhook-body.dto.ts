import OpenPixChargeStatus from '@/modules/shared/enums/openpix-charge-status.enum';
import { ApiProperty } from '@nestjs/swagger';

class ChargeDto {
  @ApiProperty({ enum: OpenPixChargeStatus })
  status: OpenPixChargeStatus;

  @ApiProperty()
  customer?: unknown;

  @ApiProperty()
  correlationID: string;

  @ApiProperty()
  transactionID: string;

  @ApiProperty()
  brCode: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
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
  time: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  transactionID: string;

  @ApiProperty()
  infoPagador: string;

  @ApiProperty()
  raw: unknown;
}

export class OpenPixPixWebhookBodyDto {
  @ApiProperty()
  charge: ChargeDto;

  @ApiProperty()
  pix: PixDto;

  @ApiProperty({ type: 'null' })
  pixQrCode: null;
}

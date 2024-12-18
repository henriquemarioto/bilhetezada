import { ApiProperty } from '@nestjs/swagger';

export class TimezoneDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'America/Sao_Paulo',
  })
  name: string;

  @ApiProperty()
  description: string;
}

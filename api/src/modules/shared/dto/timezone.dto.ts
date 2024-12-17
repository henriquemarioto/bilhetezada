import { ApiProperty } from '@nestjs/swagger';

export class TimezoneDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

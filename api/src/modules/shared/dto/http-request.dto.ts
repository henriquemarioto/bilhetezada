import { RequestMethod } from '@nestjs/common';

export class HttpRequestDto {
  method?: RequestMethod;
  path?: string;
  headers?: unknown;
  queryParams?: unknown;
  body?: object;
}

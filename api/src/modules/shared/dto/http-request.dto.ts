import { RequestMethod } from '@nestjs/common';

export class HttpRequestDto {
  constructor() {
    this.method = RequestMethod.GET;
    this.path = '';
    this.headers = {};
    this.queryParams = {};
    this.body = null;
  }

  method?: RequestMethod;
  path?: string;
  headers?: unknown;
  queryParams?: unknown;
  body?: object;
}

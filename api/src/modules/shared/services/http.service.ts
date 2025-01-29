import { Injectable } from '@nestjs/common';
import { HttpRequestDto } from '../dto/http-request.dto';
import { AxiosHeaders } from 'axios';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HttpResponse } from '../dto/http-response.dto';

@Injectable()
export class HttpService {
  constructor(private nestJsAxiosHttpService: AxiosHttpService) {}

  async get(
    url: string,
    requestDto: HttpRequestDto = {},
  ): Promise<HttpResponse | false> {
    try {
      const response = await firstValueFrom(
        this.nestJsAxiosHttpService.get(url, {
          params: requestDto.queryParams,
          headers: requestDto.headers as AxiosHeaders,
        }),
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error('Error in get request', error);
      return false;
    }
  }

  async post(
    url: string,
    requestDto: HttpRequestDto = {},
  ): Promise<false | HttpResponse> {
    try {
      const response = await firstValueFrom(
        this.nestJsAxiosHttpService.post(url, requestDto.body, {
          params: requestDto.queryParams,
          headers: requestDto.headers as AxiosHeaders,
        }),
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error('Error in post request', error);
      return false;
    }
  }
}

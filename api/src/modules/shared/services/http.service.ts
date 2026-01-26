import { HttpRequestDto } from '@/shared/dtos/http-request.dto';
import { HttpResponse } from '@/shared/dtos/http-response.dto';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  constructor(private nestJsAxiosHttpService: AxiosHttpService) { }

  async get<T = unknown>(
    url: string,
    requestDto: HttpRequestDto = {},
  ): Promise<HttpResponse<T> | false> {
    try {
      console.log('Making GET request', JSON.stringify({ url, requestDto }));

      const response = await firstValueFrom(
        this.nestJsAxiosHttpService.get(url, {
          params: requestDto.queryParams,
          headers: requestDto.headers as AxiosHeaders,
        }),
      );

      console.log('GET request successful', JSON.stringify({ url, status: response.status, data: response.data }));

      return {
        status: response.status,
        data: response.data,
      };
    } catch (e) {
      const error = e as AxiosError | Error;
      console.error(
        'Error in GET request',
        JSON.stringify({
          url,
          requestDto,
          error: {
            message: error?.message,
            stack: error?.stack,
            response: (error as AxiosError)?.response?.data,
          },
        }),
      );
      return false;
    }
  }

  async post<T = unknown>(
    url: string,
    requestDto: HttpRequestDto = {},
  ): Promise<HttpResponse<T> | false> {
    try {
      console.log('Making POST request', JSON.stringify({ url, requestDto }));

      const response = await firstValueFrom(
        this.nestJsAxiosHttpService.post(url, requestDto.body, {
          params: requestDto.queryParams,
          headers: requestDto.headers as AxiosHeaders,
        }),
      );

      console.log('POST request successful', JSON.stringify({ url, status: response.status, data: response.data }));

      return {
        status: response.status,
        data: response.data,
      };
    } catch (e) {
      const error = e as AxiosError | Error;
      console.error(
        'Error in POST request',
        JSON.stringify({
          url,
          requestDto,
          error: {
            message: error?.message,
            stack: error?.stack,
            response: (error as AxiosError)?.response?.data,
          },
        }),
      );
      return false;
    }
  }
}

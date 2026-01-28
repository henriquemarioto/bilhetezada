import { Logger } from '@/core/logger/logger.interface';
import { LOGGER } from '@/core/logger/logger.tokens';
import { HttpRequestDto } from '@/shared/dtos/http-request.dto';
import { HttpResponse } from '@/shared/dtos/http-response.dto';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosHeaders } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  private readonly logger: Logger;

  constructor(
    private nestJsAxiosHttpService: AxiosHttpService,
    @Inject(LOGGER) baseLogger: Logger,
  ) {
    this.logger = baseLogger.withContext(HttpService.name);
  }

  async get<T = unknown>(
    url: string,
    requestDto: HttpRequestDto = {},
  ): Promise<HttpResponse<T> | false> {
    try {
      this.logger.info('Making GET request', { url, requestDto });

      const response = await firstValueFrom(
        this.nestJsAxiosHttpService.get(url, {
          params: requestDto.queryParams,
          headers: requestDto.headers as AxiosHeaders,
        }),
      );

      this.logger.info('GET request successful', {
        url,
        status: response.status,
        data: response.data,
      });

      return {
        status: response.status,
        data: response.data,
      };
    } catch (e) {
      const error = e as AxiosError | Error;
      this.logger.error(
        'Error in GET request',
        {
          url,
          requestDto,
          error: {
            message: error?.message,
            response: (error as AxiosError)?.response?.data,
          },
        },
        error.stack,
      );
      return false;
    }
  }

  async post<T = unknown>(
    url: string,
    requestDto: HttpRequestDto = {},
  ): Promise<HttpResponse<T> | false> {
    try {
      this.logger.info('Making POST request', { url, requestDto });

      const response = await firstValueFrom(
        this.nestJsAxiosHttpService.post(url, requestDto.body, {
          params: requestDto.queryParams,
          headers: requestDto.headers as AxiosHeaders,
        }),
      );

      this.logger.info(
        'POST request successful',
        {
          url,
          status: response.status,
          data: response.data,
        },
      );

      return {
        status: response.status,
        data: response.data,
      };
    } catch (e) {
      const error = e as AxiosError | Error;
      this.logger.error(
        'Error in POST request',
        {
          url,
          requestDto,
          error: {
            message: error?.message,
            response: (error as AxiosError)?.response?.data,
          },
        },
        error.stack,
      );
      return false;
    }
  }
}

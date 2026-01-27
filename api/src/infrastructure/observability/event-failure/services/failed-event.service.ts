import { Injectable } from '@nestjs/common';
import { FailedEventRepository } from '../repositories/failed-event.repository';
import { AxiosError } from 'axios';

@Injectable()
export class FailedEventService {
  constructor(
    private readonly failedEventRepository: FailedEventRepository,
  ) {}

  async registerFailure(
    eventName: string,
    eventSource: string,
    payload: Record<string, any>,
    error: Error | AxiosError | unknown,
  ): Promise<void> {
    console.log('Registering failed event:', {
      eventName,
      eventSource,
      payload,
      error,
    });
    try {
      await this.failedEventRepository.saveFailure(
        eventName,
        eventSource,
        payload,
        error,
      );
    } catch (err) {
      // Não lançar exceções - apenas silenciar
    }
  }
}

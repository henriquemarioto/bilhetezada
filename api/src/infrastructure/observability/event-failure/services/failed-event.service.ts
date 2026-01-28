import { Inject, Injectable } from '@nestjs/common';
import { FailedEventRepository } from '../repositories/failed-event.repository';
import { AxiosError } from 'axios';
import { LOGGER } from '@/core/logger/logger.tokens';
import { Logger } from '@/core/logger/logger.interface';

@Injectable()
export class FailedEventService {
  private readonly logger: Logger;

  constructor(
    private readonly failedEventRepository: FailedEventRepository,
    @Inject(LOGGER)
    baseLogger: Logger,
  ) {
    this.logger = baseLogger.withContext(FailedEventService.name);
  }

  async registerFailure(
    eventName: string,
    eventSource: string,
    payload: Record<string, any>,
    error: Error | AxiosError | unknown,
  ): Promise<void> {
    this.logger.info('Registering failed event', {
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
      // Não lançar exceções - apenas silenciar erros ao registrar falhas

      const stack =
        typeof err === 'string'
          ? err
          : err instanceof Error || err instanceof AxiosError
            ? err.stack || ''
            : 'no_stack';

      this.logger.error(
        'Failed to register failed event',
        {
          eventName,
          eventSource,
          payload,
          error,
          err,
        },
        stack,
      );
    }
  }
}

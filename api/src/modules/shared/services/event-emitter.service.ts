import { Logger } from '@/core/logger/logger.interface';
import { LOGGER } from '@/core/logger/logger.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class EventEmitterService {
  private readonly logger: Logger;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(LOGGER) baseLogger: Logger,
  ) {
    this.logger = baseLogger.withContext(EventEmitterService.name);
  }

  emit(event: string, payload: any): void {
    this.logger.info(`Emitindo evento: ${event}`, { payload });
    this.eventEmitter.emit(event, payload);
  }

  emitAsync(event: string, payload: any): void {
    this.logger.info(`Emitindo evento assíncrono: ${event}`, { payload });
    this.eventEmitter.emitAsync(event, payload);
  }
}

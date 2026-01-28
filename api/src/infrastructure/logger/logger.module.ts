import { LOGGER } from '@/core/logger/logger.tokens';
import { Global, Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console-logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useClass: ConsoleLoggerService,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}

import { Logger } from '@/core/logger/logger.interface';

export class ConsoleLoggerService implements Logger {
  constructor(private readonly context?: string) {}

  withContext(context: string): Logger {
    return new ConsoleLoggerService(context);
  }

  info(message: string, data?: Record<string, any>): void {
    const logMessage = this.formatMessage('INFO', message, data);
    console.log(logMessage);
  }

  warn(message: string, data?: Record<string, any>): void {
    const logMessage = this.formatMessage('WARN', message, data);
    console.warn(logMessage);
  }

  error(message: string, data?: Record<string, any>, trace?: string): void {
    const logMessage = this.formatMessage('ERROR', message, data);
    console.error(logMessage);
    if (trace) {
      console.error(trace);
    }
  }

  private formatMessage(
    level: string,
    message: string,
    data?: Record<string, any>,
  ): string {
    const contextPart = this.context ? `[${this.context}]` : '';
    const dataPart = data ? ` ${JSON.stringify(data)}` : '';
    return `[${level}] ${contextPart} ${message}${dataPart}`.trim();
  }
}

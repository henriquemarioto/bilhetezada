export interface Logger {
  withContext(context: string): Logger;

  info(message: string, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  error(message: string, data?: Record<string, any>, trace?: string,): void;
}

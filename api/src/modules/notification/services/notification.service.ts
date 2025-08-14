export interface NotificationService {
  send(
    to: string,
    message: string,
    subject?: string,
    templateVariables?: Record<string, any>,
  ): Promise<void>;
}

export interface WebhookInterface {
  handleWebhook(data: any): Promise<boolean>;
}

import { NotificationChannel } from '@/shared/enums/notification-channel.enum';

export type EmailData = {
  content: string;
  subject: string;
};

export type SmsData = {
  messageText: string;
};

export type WhatsappData = {
  buttonUrl?: string;
  buttonLabel?: string;
  footerText?: string;
  bodyText?: string;
  headerText?: string;
};

export class SendNotificationDto {
  channel: NotificationChannel;
  to: string;
  data: EmailData | SmsData | WhatsappData;
}

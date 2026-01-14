import { SendNotificationDto } from '../dtos/send-notificaiton.dto';

export interface NotificationProviderInterface {
  send(data: SendNotificationDto): Promise<void>;
}

import { EmailData } from '../dtos/send-notificaiton.dto';

export const isEmailData = (data: any): data is EmailData => {
  return (
    data && typeof data.subject === 'string' && typeof data.content === 'string'
  );
};

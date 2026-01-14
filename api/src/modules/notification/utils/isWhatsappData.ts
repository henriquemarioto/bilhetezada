import { WhatsappData } from '../dtos/send-notificaiton.dto';

export const isWhatsappData = (data: any): data is WhatsappData => {
  return (
    data &&
    (typeof data.bodyText === 'string' ||
      typeof data.buttonLabel === 'string' ||
      typeof data.buttonUrl === 'string' ||
      typeof data.footerText === 'string' ||
      typeof data.headerText === 'string')
  );
};

import { Injectable } from '@nestjs/common';
import { HttpService } from './http.service';

type SendEmailProps = {
  serviceId: string;
  templateId: string;
  userId: string;
  templateParams: Record<string, any>;
};

@Injectable()
export class MessagingService {
  constructor(private readonly httpService: HttpService) {}

  async sendEmail({
    serviceId,
    templateId,
    userId,
    templateParams,
  }: SendEmailProps): Promise<boolean> {
    const response = await this.httpService.post(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        body: {
          service_id: serviceId,
          template_id: templateId,
          user_id: userId,
          template_params: templateParams,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return Boolean(response);
  }
}

import { Environments } from '@/shared/enums/environments.enum';
import { ConfigService } from '@nestjs/config';

export function getFromEmail(configService: ConfigService): string {
  return configService.get('nodeEnv') === Environments.DEVELOPMENT
    ? 'onboarding@resend.dev'
    : configService.get('resendFromEmail') || '';
}

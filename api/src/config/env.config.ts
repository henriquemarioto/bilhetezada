import { Environments } from '@/shared/enums/environments.enum';
import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsHexadecimal,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPort,
  IsString,
  IsUrl,
  Length,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsEnum(Environments, {
    message: 'invalid environment',
  })
  NODE_ENV: Environments;

  @IsPort()
  PORT: string = '3132';

  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  GOOGLE_SECRET: string;

  @IsString()
  @IsNotEmpty()
  SESSION_SECRET: string;

  @IsNumber()
  @Min(1000)
  SESSION_MAX_AGE: number = 86400000;

  @IsBoolean()
  SESSION_RESAVE: boolean = false;

  @IsBoolean()
  SESSION_SAVE_UNINITIALIZED: boolean = false;

  @IsHexadecimal()
  @Length(64, 64, {
    message: 'CRYPT_SECRET_KEY deve ter 64 caracteres hexadecimais (32 bytes)',
  })
  CRYPT_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNumber()
  @Min(1)
  CHARGE_EXPIRATION_SECONDS_DEFAULT: number = 600;

  @IsUrl({ require_tld: false })
  WOOVI_API_URL: string;

  @IsString()
  WOOVI_APPID: string;

  @IsUrl({ require_tld: false })
  RESEND_API_BASE_URL: string;

  @IsString()
  RESEND_API_KEY: string;

  @IsString()
  @IsOptional()
  WHATSAPP_CLOUD_API_VERSION: string;

  @IsString()
  @IsOptional()
  WHATSAPP_CLOUD_API_PHONE_NUMBER_ID: string;

  @IsString()
  @IsOptional()
  WHATSAPP_CLOUD_API_ACCESS_TOKEN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'Erro desconhecido';
        return `${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(
      `\n\nErro na validação das variáveis de ambiente:\n\n${messages}\n\nA aplicação não pode iniciar com configurações inválidas.\n`,
    );
  }

  return validatedConfig;
}

export type Env = {
  nodeEnv: Environments;
  port: number;
  redisUrl: string;
  google: {
    clientId: string;
    secret: string;
  };
  session: {
    secret: string;
    cookieMaxAge: number;
    reSave: boolean;
    saveUninitialized: boolean;
  };
  cryptSecretKey: string;
  jwtSecret: string;
  defaultChargeExpirationSeconds: number;
  wooviApiUrl: string;
  wooviAppId: string;
  applicationEmail: string;
  resendApiBaseUrl: string;
  resendApiKey: string;
  whatsappCloudApiVersion: string;
  whatsappCloudApiPhoneNumberId: string;
  whatsappCloudApiAccessToken: string;
};

export default (): Env => ({
  nodeEnv: process.env.NODE_ENV as Environments || '',
  port: parseInt(process.env.PORT || '', 10) || 3132,
  redisUrl: process.env.REDIS_URL || '',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    secret: process.env.GOOGLE_SECRET || '',
  },
  session: {
    secret: process.env.SESSION_SECRET || '',
    cookieMaxAge: Number(process.env.SESSION_MAX_AGE) || 86400000,
    reSave: Boolean(process.env.SESSION_RESAVE),
    saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED),
  },
  cryptSecretKey: process.env.CRYPT_SECRET_KEY || '',
  jwtSecret: process.env.JWT_SECRET || '',
  defaultChargeExpirationSeconds:
    Number(process.env.CHARGE_EXPIRATION_SECONDS_DEFAULT) || 600,
  wooviApiUrl: process.env.WOOVI_API_URL || '',
  wooviAppId: process.env.WOOVI_APPID || '',
  applicationEmail: process.env.APPLICATION_EMAIL || '',
  resendApiBaseUrl: process.env.RESEND_API_BASE_URL || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  whatsappCloudApiVersion: process.env.WHATSAPP_CLOUD_API_VERSION || '',
  whatsappCloudApiPhoneNumberId:
    process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID || '',
  whatsappCloudApiAccessToken:
    process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN || '',
});

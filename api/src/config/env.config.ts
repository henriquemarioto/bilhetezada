export type Env = {
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
  cryptIv: string;
  jwtSecret: string;
  defaultChargeExpirationSeconds: number;
  wooviApiUrl: string;
  wooviAppId: string;
  resendApiBaseUrl: string;
  resendApiKey: string;
  whatsappCloudApiVersion: string;
  whatsappCloudApiPhoneNumberId: string;
  whatsappCloudApiAccessToken: string;
};

export default (): Env => ({
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
  cryptIv: process.env.CRYPT_IV || '',
  jwtSecret: process.env.JWT_SECRET || '',
  defaultChargeExpirationSeconds:
    Number(process.env.CHARGE_EXPIRATION_SECONDS_DEFAULT) || 600,
  wooviApiUrl: process.env.WOOVI_API_URL || '',
  wooviAppId: process.env.WOOVI_APPID || '',
  resendApiBaseUrl: process.env.RESEND_API_BASE_URL || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  whatsappCloudApiVersion: process.env.WHATSAPP_CLOUD_API_VERSION || '',
  whatsappCloudApiPhoneNumberId:
    process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID || '',
  whatsappCloudApiAccessToken:
    process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN || '',
});

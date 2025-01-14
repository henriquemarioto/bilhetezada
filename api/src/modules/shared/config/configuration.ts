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
  openPixApiUrl: string;
  openPixAppId: string;
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
  cryptSecretKey: process.env.CRYPT_SECRET_KEY,
  cryptIv: process.env.CRYPT_IV,
  jwtSecret: process.env.JWT_SECRET,
  openPixApiUrl: process.env.OPENPIX_API_URL,
  openPixAppId: process.env.OPENPIX_APPID,
});

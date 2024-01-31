import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect();
  redisClient.on('connect', () =>
    console.log('Connected to redis successfully.'),
  );
  redisClient.on('error', (err) =>
    console.log('Unable to connect to redis. ' + err),
  );

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: 'Bilhetezada',
      secret: process.env.SESSION_SECRET,
      resave: Boolean(process.env.SESSION_RESAVE),
      saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED),
      cookie: {
        maxAge: Number(process.env.SESSION_MAX_AGE),
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();

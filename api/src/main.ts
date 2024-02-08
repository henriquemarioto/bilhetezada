import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Env } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<Env, true>>(ConfigService);

  const redisClient = createClient({
    url: configService.get('redisUrl'),
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
      secret: configService.get('session.secret', { infer: true }),
      resave: configService.get('session.reSave', { infer: true }),
      saveUninitialized: configService.get('session.saveUninitialized', {
        infer: true,
      }),
      cookie: {
        maxAge: configService.get('session.cookieMaxAge', { infer: true }),
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('port'));
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import { Env } from './modules/shared/config/configuration';
import { LoggerService } from './modules/shared/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

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

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useLogger(app.get(LoggerService));

  const config = new DocumentBuilder()
    .setTitle('Bilhetezada API')
    .setDescription('API for Bilhetezada application')
    .setVersion('1.0')
    .addTag('Bilhetezada')
    .addBearerAuth()
    .addServer('http://localhost:3132')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json',
    customSiteTitle: 'Bilhetezada docs',
  });

  await app.listen(configService.get('port'));
}
bootstrap();

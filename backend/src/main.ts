import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // aplica os @Transform (ex.: trim do userId)
      whitelist: true, // descarta campos não declarados nos DTOs
    }),
  );

  app.enableCors({
    origin: config
      .getOrThrow<string>('FRONTEND_ORIGIN')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  });

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);
  Logger.log(`API disponível em http://localhost:${port}`, 'Bootstrap');
}

bootstrap();

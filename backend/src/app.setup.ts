import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Configuração HTTP do app (validação e CORS).
 * Fica separada do main.ts para ser reaproveitada pelos testes e2e,
 * garantindo que eles exercitem exatamente as mesmas regras da aplicação real.
 */
export function configureApp(app: INestApplication): void {
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
}

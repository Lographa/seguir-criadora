import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

/**
 * Cria uma instância nova da aplicação com seu próprio banco SQLite em memória.
 * Cada chamada gera um banco independente (e já com a criadora inicial cadastrada
 * no bootstrap), então nenhum teste enxerga dados deixados por outro.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init(); // dispara o seed da criadora inicial
  return app;
}

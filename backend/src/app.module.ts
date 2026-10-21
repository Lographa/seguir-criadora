import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.validation';
import { CreatorsController } from './controllers/creators.controller';
import { FollowersController } from './controllers/followers.controller';
import { Creator } from './entities/creator.entity';
import { Follower } from './entities/follower.entity';
import { CreatorsService } from './services/creators.service';
import { FollowersService } from './services/followers.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbPath = config.getOrThrow<string>('DB_PATH');
        const database = dbPath === ':memory:' ? dbPath : resolve(dbPath);
        // O SQLite cria o arquivo, mas não a pasta onde ele ficará.
        if (database !== ':memory:') mkdirSync(dirname(database), { recursive: true });

        return {
          type: 'better-sqlite3' as const,
          database,
          entities: [Creator, Follower],
          // Simples para este desafio; em produção o ideal seria usar migrations.
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([Creator, Follower]),
  ],
  controllers: [CreatorsController, FollowersController],
  providers: [CreatorsService, FollowersService],
})
export class AppModule {}

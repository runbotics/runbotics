import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfigService } from '../config/server-config';
import { ConfigModule } from '../config/config.module';
import { getMigrations } from './database.utils';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (serverConfigService: ServerConfigService) => {
        return {
          type: 'postgres',
          host: serverConfigService.dbSettings.host,
          port: serverConfigService.dbSettings.port,
          username: serverConfigService.dbSettings.username,
          password: serverConfigService.dbSettings.password,
          database: serverConfigService.dbSettings.database,
          schema: 'runbotics_nest_test',
          migrationsRun: true,
          migrationsTableName: 'migration',
          migrations: getMigrations(),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
      inject: [ServerConfigService],
    }),
  ],
})
export class DatabaseModule {}

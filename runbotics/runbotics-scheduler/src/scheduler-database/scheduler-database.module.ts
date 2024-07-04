import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServerConfigService } from '#/config/server-config';
import { ConfigModule } from '#/config/config.module';
import { SecretModule } from '#/scheduler-database/secret/secret.module';
import { ProcessContextModule } from '#/scheduler-database/process-context/process-context.module';
import { ProcessContextSecretModule } from '#/scheduler-database/process-context-secret/process-context-secret.module';
import { DatabaseModule } from '#/database/database.module';

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
                    migrationsRun: true,
                    migrationsTableName: 'rb_migrations.migration',
                    migrations: ['dist/src/migrations/*.js'],
                    entities: ['dist/src/**/*.entity{.ts,.js}'],
                    synchronize: false,
                };
            },
            inject: [ServerConfigService],
        }),
        DatabaseModule,
        SecretModule,
        ProcessContextModule,
        ProcessContextSecretModule,
    ],
    exports: [],
})
export class SchedulerDatabaseModule { }

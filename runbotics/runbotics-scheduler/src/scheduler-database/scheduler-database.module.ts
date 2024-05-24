import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfigService } from '../config/server-config/server-config.service';
import { ConfigModule } from '../config/config.module';

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
                    entities: ['dist/src/scheduler-database/**/*.entity{.ts,.js}'],
                    synchronize: false,
                };
            },
            inject: [ServerConfigService]
        }),
    ],
    exports: [],
})
export class SchedulerDatabaseModule { }

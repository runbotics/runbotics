import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfigService } from '#/config/server-config';
import { ConfigModule } from '#/config/config.module';
import { BotModule } from '#/scheduler-database/bot/bot.module';
import { BotCollectionModule } from '#/scheduler-database/bot-collection/bot-collection.module';
import { BotSystemModule } from '#/scheduler-database/bot-system/bot-system.module';
import { ProcessModule } from '#/scheduler-database/process/process.module';

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
            inject: [ServerConfigService]
        }),
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        ProcessModule,
        TypeOrmModule,
    ],
    exports: [
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        ProcessModule,
        TypeOrmModule,
    ],
})
export class DatabaseModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfigService } from '#/config/server-config';
import { ConfigModule } from '#/config/config.module';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { ProcessModule } from './process/process.module';
import { BotCollectionModule } from './bot-collection/bot-collection.module';
import { BotSystemModule } from './bot-system/bot-system.module';
import { GuestModule } from './guest/guest.module';

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
        UserModule,
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        ProcessModule,
        GuestModule,
        TypeOrmModule,
    ],
    exports: [
        UserModule,
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        ProcessModule,
        GuestModule,
        TypeOrmModule,
    ],
})
export class DatabaseModule { }

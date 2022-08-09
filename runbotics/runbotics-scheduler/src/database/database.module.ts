import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ServerConfigService } from '../config/serverConfig.service';
import { ConfigModule } from '../config/config.module';
import { AuthorityModule } from './authority/authority.module';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { GlobalVariableModule } from './global_variable/global_variable.module';
import { ProcessModule } from './process/process.module';
import { ProcessInstanceModule } from './process_instance/process_instance.module';
import { ProcessInstanceEventModule } from './process_instance_event/process_instance_event.module';
import { ScheduleProcessModule } from './schedule-process/schedule-process.module';
import { BotCollectionModule } from './bot_collection/bot_collection.module';
import { BotSystemModule } from './bot_system/bot_system.module';
import { FeatureKeyModule } from './feature_key/featureKey.module';

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
                    entities: ['dist/**/*.entity{.ts,.js}'],
                    synchronize: false,
                } as TypeOrmModuleOptions;
            },
            inject: [ServerConfigService]
        }),
        AuthorityModule,
        FeatureKeyModule,
        UserModule,
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        GlobalVariableModule,
        ProcessModule,
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        ScheduleProcessModule,
    ],
    exports: [
        TypeOrmModule,
        AuthorityModule,
        FeatureKeyModule,
        UserModule,
        BotModule,
        BotCollectionModule,
        BotSystemModule,
        GlobalVariableModule,
        ProcessModule,
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        ScheduleProcessModule,
    ]
})
export class DatabaseModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerConfigService } from '../config/server-config/server-config.service';
import { ConfigModule } from '../config/config.module';
import { AuthorityModule } from './authority/authority.module';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { GlobalVariableModule } from './global-variable/global-variable.module';
import { ProcessModule } from './process/process.module';
import { ProcessInstanceModule } from './process-instance/process-instance.module';
import { ProcessInstanceEventModule } from './process-instance-event/process-instance-event.module';
import { ScheduleProcessModule } from './schedule-process/schedule-process.module';
import { BotCollectionModule } from './bot-collection/bot-collection.module';
import { BotSystemModule } from './bot-system/bot-system.module';
import { FeatureKeyModule } from './feature-key/feature-key.module';
import { TriggerEventModule } from './trigger-event/trigger-event.module';
import { ProcessInstanceLoopEventModule } from './process-instance-loop-event/process-instance-loop-event.module';
import { GuestModule } from './guest/guest.module';
import { TenantModule } from '#/database/tenant/tenant.module';
import { ProcessContextModule } from '#/database/process-context/process-context.module';
import { ProcessContextSecretModule } from '#/database/process-context-secret/process-context-secret.module';
import { SecretModule } from '#/database/secret/secret.module';

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
                    entities: ['dist/src/database/**/*.entity{.ts,.js}'],
                    synchronize: false,
                };
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
        ProcessInstanceLoopEventModule,
        ScheduleProcessModule,
        TriggerEventModule,
        GuestModule,
        TenantModule,
        ProcessContextModule,
        ProcessContextSecretModule,
        SecretModule,
    ],
    exports: [
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
        ProcessInstanceLoopEventModule,
        ScheduleProcessModule,
        TriggerEventModule,
        GuestModule,
        TenantModule,
        ProcessContextModule,
        ProcessContextSecretModule,
        SecretModule,
    ],
})
export class DatabaseModule { }

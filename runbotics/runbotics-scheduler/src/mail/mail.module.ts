import { forwardRef, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { Logger } from '#/utils/logger';
import { ServerConfigService } from '#/config/server-config/server-config.service';
import { BotModule } from '#/scheduler-database/bot/bot.module';
import { ProcessModule } from '#/scheduler-database/process/process.module';
import { NotificationProcessModule } from '#/scheduler-database/notification-process/notification-process.module';
import { NotificationBotModule } from '#/scheduler-database/notification-bot/notification-bot.module';
import { I18nService } from './i18n.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ ServerConfigService ],
            useFactory: (config: ServerConfigService) => ({
                transport: {
                    host: config.mailConfig.mailHost,
                    port: Number(config.mailConfig.mailPort),
                    secure: false,
                    tls: { rejectUnauthorized: false },
                    auth: {
                        user: config.mailConfig.mailUsername,
                        pass: config.mailConfig.mailPassword,
                    },
                },
                defaults: {
                    from: config.mailConfig.mailUsername,
                },
            }),
        }),
        Logger,
        forwardRef(() => BotModule),
        ProcessModule,
        NotificationProcessModule,
        NotificationBotModule,
    ],
    providers: [MailService, I18nService],
    exports: [MailService],
})
export class MailModule {}

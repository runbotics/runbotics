import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { UserModule } from '#/database/user/user.module';
import { Logger } from '#/utils/logger';
import { ServerConfigService } from '#/config/server-config/server-config.service';
import { BotModule } from '#/scheduler-database/bot/bot.module';
import { ProcessModule } from '#/scheduler-database/process/process.module';

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
        UserModule,
        Logger,
        BotModule,
        ProcessModule,
        UserModule,
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}

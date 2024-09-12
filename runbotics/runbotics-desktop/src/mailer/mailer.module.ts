import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule, MailerOptionsFactory, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServerConfigService } from '#config';
import { ArgumentsService } from '#config/arguments.service';

@Module({
    imports: [
        NestMailerModule.forRootAsync({
            useFactory: (serverConfigService: ServerConfigService) => ({
                transport: {
                    host: serverConfigService.mailHost,
                    port: Number(serverConfigService.mailPort),
                    secure: false, // upgrade later with STARTTLS
                    tls: { rejectUnauthorized: false },
                    auth: {
                        user: serverConfigService.mailUsername,
                        pass: serverConfigService.mailPassword,
                    },
                },
                defaults: {
                    from: 'runbotics',
                },
                template: {
                    dir: process.cwd() + '/templates/',
                    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ServerConfigService, ArgumentsService],
        }),
    ],
    providers: [ServerConfigService, ArgumentsService],
})
export class MailerModule {}

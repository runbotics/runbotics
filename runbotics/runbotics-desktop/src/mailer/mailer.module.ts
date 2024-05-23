import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServerConfigService } from '#config';

@Module({
    imports: [
        NestMailerModule.forRootAsync({
            useFactory: (serverConfigService: ServerConfigService) => ({
                transport: {
                    host: serverConfigService.mailHost,
                    port: Number(serverConfigService.mailPort),
                    secure: false, // upgrade later with STARTTLS
                    tls: { rejectUnauthorized: false },
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
            inject: [ServerConfigService],
        }),
    ],
    providers: [ServerConfigService],
})
export class MailerModule {}

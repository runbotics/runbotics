import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NestMailerService } from './nest-mailer.service';
import { UserModule } from '#/database/user/user.module';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: Number(process.env.MAIL_PORT),
                    secure: false, // upgrade later with STARTTLS
                    tls: { rejectUnauthorized: false },
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: process.env.MAIL_USERNAME,
                },
            }),
        }),
        UserModule,
    ],
    providers: [NestMailerService],
    exports: [NestMailerService],
})
export class NestMailerModule {}

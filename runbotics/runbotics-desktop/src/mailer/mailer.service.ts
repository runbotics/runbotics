import { Injectable } from '@nestjs/common';
import { MailCredential } from '#action/mail/mail.types';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    async sendMail({ to, from, subject, html }: Mail.Options, auth: MailCredential) {
        const transporter = nodemailer.createTransport({
            host: auth.mailHost,
            port: auth.mailPort,
            secure: true,
            auth: {
                user: auth.mailUsername,
                pass: auth.mailPassword,
            },
        });

        await transporter.sendMail({
            to,
            from,
            subject,
            html,
        });
    }
}

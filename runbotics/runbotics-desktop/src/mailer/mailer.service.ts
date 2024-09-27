import { Injectable } from '@nestjs/common';
import { MailCredential } from '#action/mail/mail.types';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    async sendMail({ to, from, subject, html, cc, attachments }: Mail.Options, credential: MailCredential) {
        const transporter = nodemailer.createTransport({
            host: credential.mailHost,
            port: credential.mailPort,
            auth: {
                user: credential.mailUsername,
                pass: credential.mailPassword,
            },
            // secure: true, // false (default) for openssl version 1.1.1, true for ^3.1.1
            tls: { rejectUnauthorized: false },
        });

        await transporter.sendMail({
            to,
            cc,
            from,
            subject,
            html,
            attachments,
        });
    }
}

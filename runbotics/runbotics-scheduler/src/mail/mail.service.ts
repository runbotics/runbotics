import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';
import { IBot, IProcess, IProcessInstance } from 'runbotics-common';
import { Logger } from '#/utils/logger';

export type SendMailInput = {
    to: string;
    cc?: string;
    subject: string;
    content: string;
    attachment?: string;
};

const NOTIFICATION_MAIL_SUBJECT = 'RunBotics Healthcheck Notification 🔧';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
    ) {}

    public async sendMail(input: SendMailInput) {
        const sendMailOptions: ISendMailOptions = {
            to: input.to,
            from: process.env.MAIL_USERNAME,
            subject: input.subject,
            text: input.content,
        };

        const cc = input.cc;
        if (cc) {
            sendMailOptions['cc'] = cc;
        }

        const attachment = input.attachment;
        if (attachment) {
            const fileName = attachment.substring(attachment.lastIndexOf('\\') + 1);
            sendMailOptions['attachments'] = [
                {
                    filename: fileName,
                    content: fs.readFileSync(attachment),
                },
            ];
        }

        await this.mailerService.sendMail(sendMailOptions)
            .catch(error => {
                this.logger.error(`Failed to send the mail with error: ${error.message}`);
            });
    }

    public async sendBotDisconnectionNotificationMail(bot: IBot, installationId: string) {
        await this.sendMail({
            to: bot.user.email ?? '',
            subject: NOTIFICATION_MAIL_SUBJECT,
            content: `Hello,\n\nBot 🤖 (${installationId}) has been disconnected.\n\nBest regards,\nRunBotics`,
        });
    }

    public async sendProcessFailureNotificationMail(process: IProcess, processInstance: IProcessInstance) {
        await this.sendMail({
            to: process.createdBy.email ?? '',
            subject: NOTIFICATION_MAIL_SUBJECT,
            content: `Hello,\n\nProcess ⚙️ ${process.name} (${process.id}) has failed with status (${processInstance.status}).\n\nBest regards,\nRunBotics`,
        });
    }
}

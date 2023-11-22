import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';
import { IBot, IProcess, IProcessInstance, Role } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { BotService } from '#/database/bot/bot.service';
import { ProcessService } from '#/database/process/process.service';
import { UserService } from '#/database/user/user.service';
import { mergeArrays } from '#/utils/mergeArrays';

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
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly userService: UserService
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
        const disconnectedBot = await this.botService.findById(bot.id);

        if (disconnectedBot.subscribers && disconnectedBot.subscribers.length) {
            const subscribers = disconnectedBot.subscribers;
            const emailAddresses = subscribers.map(({ email }) => email).join(',');

            await this.sendMail({
                to: emailAddresses,
                subject: NOTIFICATION_MAIL_SUBJECT,
                content: `Hello,\n\nBot 🤖 (${installationId}) has been disconnected.\n\nBest regards,\nRunBotics`,
            });
        }
    }

    public async sendProcessFailureNotificationMail(process: IProcess, processInstance: IProcessInstance) {
        const failedProcess = await this.processService.findById(process.id);
        const processCreatorEmail = failedProcess.createdBy.email;
        const subscribers = failedProcess.subscribers;

        const sendMailInput: SendMailInput = {
            to: '',
            subject: NOTIFICATION_MAIL_SUBJECT,
            content: `Hello,\n\nProcess ⚙️ ${process.name} (${process.id}) has failed with status (${processInstance.status}).\n\nBest regards,\nRunBotics`,
        };

        if (!failedProcess.isPublic) {
            const admins = await this.userService.findAllByRole(Role.ROLE_ADMIN);
            const adminsIds = admins.map(admin => admin.id);
            const filteredSubscribers =
                subscribers && subscribers.length
                    ? subscribers.reduce((acc, subscriber) => {
                            if (adminsIds.includes(subscriber.id)) {
                                acc.push(subscriber.email);
                            }
                            return acc;
                        }, [])
                    : [];

            const emailAddresses = mergeArrays([
                processCreatorEmail,
                ...filteredSubscribers,
            ]).join(',');

            await this.sendMail({ ...sendMailInput, to: emailAddresses });
        } else {
            const subscribersAddresses =
                subscribers && subscribers.length
                    ? subscribers.map(({ email }) => email)
                    : [];

            const emailAddresses = mergeArrays([
                processCreatorEmail,
                ...subscribersAddresses,
            ]).join(',');

            await this.sendMail({...sendMailInput, to: emailAddresses });
        }
    }
}

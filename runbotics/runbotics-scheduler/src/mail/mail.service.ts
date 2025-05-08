import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';
import { IProcess, IProcessInstance, Role } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { mergeArraysWithoutDuplicates } from '#/utils/mergeArrays';
import { ServerConfigService } from '#/config/server-config';
import { CredentialChangeMailPayload, CredentialOperationType } from '#/scheduler-database/credential/credential.utils';
import { User } from '#/scheduler-database/user/user.entity';
import { NotificationProcessService } from '#/scheduler-database/notification-process/notification-process.service';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';
import { NotificationBotService } from '#/scheduler-database/notification-bot/notification-bot.service';
import { DeleteUserDto } from '#/scheduler-database/user/dto/delete-user.dto';
import { hasRole } from '#/utils/authority.utils';

export type SendMailInput = {
    to?: string;
    cc?: string;
    bcc?: string;
    subject: string;
    content: string;
    attachment?: string;
    isHtml: boolean;
};


const NOTIFICATION_MAIL_SUBJECT = 'RunBotics Healthcheck Notification 🔧';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly notificationProcessService: NotificationProcessService,
        private readonly notificationBotService: NotificationBotService,
        private readonly serverConfigService: ServerConfigService
    ) { }

    public async sendMail(input: SendMailInput) {
        const sendMailOptions: ISendMailOptions = {
            from: process.env.MAIL_USERNAME,
            subject: input.subject,
            [input.isHtml ? 'html' : 'text']: input.content,
        };

        const to = input.to;
        if (to) {
            sendMailOptions['to'] = to;
        }
        const cc = input.cc;
        if (cc) {
            sendMailOptions['cc'] = cc;
        }
        const bcc = input.bcc;
        if (bcc) {
            sendMailOptions['bcc'] = bcc;
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

    public async sendBotDisconnectionNotificationMail(bot: BotEntity, installationId: string) {
        const disconnectedBot = await this.botService.findById(bot.id);
        const botAssignedUserEmail = disconnectedBot.user.email;
        const subscribers = await this.notificationBotService
            .getAllByBotId(disconnectedBot.id)
            .then((notifications) =>
                notifications.map((notification) => notification.user)
            );

        const sendMailInput: SendMailInput = {
            subject: NOTIFICATION_MAIL_SUBJECT,
            content: `Hello,\n\nBot 🤖 (${installationId}) has been disconnected.\nYou can visit us here ${this.serverConfigService.entrypointUrl}\n\nBest regards,\nRunBotics`,
            isHtml: false,
        };

        if (disconnectedBot.collection.name !== 'Public') {
            const filteredSubscribers = subscribers.reduce((acc, subscriber) => {
                const botCollectionAssignedUser = disconnectedBot.collection.users
                    .find(user => user.id === subscriber.id);

                botCollectionAssignedUser && acc.push(subscriber.email);

                return acc;
            }, []);

            await this.handleNotificationEmail(sendMailInput, [botAssignedUserEmail, ...filteredSubscribers]);
        } else {
            const subscribersAddresses = subscribers.map(e => e.email);
            await this.handleNotificationEmail(sendMailInput, [botAssignedUserEmail, ...subscribersAddresses]);
        }
    }

    public async sendProcessFailureNotificationMail(process: IProcess, processInstance: IProcessInstance) {
        const failedProcess = await this.processService.findById(process.id);
        const processCreatorEmail = failedProcess.createdBy.email;
        const subscriptions = await this.notificationProcessService
            .getAllByProcessId(failedProcess.id);

        const sendMailInput: SendMailInput = {
            subject: NOTIFICATION_MAIL_SUBJECT,
            content: `Hello,\n\nProcess ⚙️ ${process.name} (${process.id}) has failed with status (${processInstance.status}).\nYou can visit us here ${this.serverConfigService.entrypointUrl}/app/processes/${process.id}/run?instanceId=${processInstance.id}\n\nBest regards,\nRunBotics`,
            isHtml: false,
        };
        if (!failedProcess.isPublic) {
            const filteredSubscriptions = subscriptions
                .filter(sub => hasRole(sub.user, Role.ROLE_ADMIN) || hasRole(sub.user, Role.ROLE_TENANT_ADMIN))
                .map(notification => notification.getNotificationEmail())
                .filter(email => !!email);

            await this.handleNotificationEmail(sendMailInput, [processCreatorEmail, ...filteredSubscriptions]);
        } else {
            const subscribersAddresses = subscriptions.map(notification => notification.getNotificationEmail()).filter(email => !!email);
            await this.handleNotificationEmail(sendMailInput, [processCreatorEmail, ...subscribersAddresses]);
        }
    }

    public sendCredentialChangeNotificationMail(params: CredentialChangeMailPayload) {
        const {
            editorEmail,
            collectionCreatorEmail,
            collectionName,
            credentialName,
            credentialOldName,
            operationType,
        } = params;

        const attributeInfo = operationType === CredentialOperationType.CHANGE_ATTRIBUTE
            ? ` with name <i>${params.attributeName}</i> for` : '';
        const oldNameInfo = CredentialOperationType.EDIT && credentialOldName
            ? ` (name before change <b>${credentialOldName}</b>)` : '';

        const message = `User with email <b>${editorEmail}</b> ${operationType}${attributeInfo} credential <b>${credentialName}</b>${oldNameInfo} in collection <b>${collectionName}</b>`;

        const sendMailInput: SendMailInput = {
            to: collectionCreatorEmail,
            subject: 'Credential change inside owned collection',
            content: message,
            isHtml: true,
        };

        this.sendMail(sendMailInput);
    }

    public sendUserDeclineReasonMail(userToDelete: User, userDto: DeleteUserDto) {
        if (userDto && 'declineReason' in userDto) {
            this.sendMail({
                to: userToDelete.email,
                subject: 'RunBotics - User Activation',
                content: userDto.declineReason,
                isHtml: false,
            });
        }
    }

    public sendUserAcceptMail(userToUpdate: User, message: string) {
        if(message) {
            this.sendMail({
                to: userToUpdate.email,
                subject: 'RunBotics - User Activation',
                content: message,
                isHtml: false,
            });
        }
    }

    private async handleNotificationEmail(emailInput: SendMailInput, addresses: string[]) {
        const emailAddresses = mergeArraysWithoutDuplicates(addresses).join(',');

        await this.sendMail({ ...emailInput, bcc: emailAddresses });
    }
}

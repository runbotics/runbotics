import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { DefaultCollections, IProcess, IProcessInstance, Language, Role } from 'runbotics-common';
import { ProcessStatisticsResult } from '#/types';
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
import { NotificationBot } from '#/scheduler-database/notification-bot/notification-bot.entity';
import { NotificationProcess } from '#/scheduler-database/notification-process/notification-process.entity';
import { subscriptionExpirationNotificationTemplate } from './templates/i18n/subscription-expiration-notification.template';
import { generateAggregatedEmailContent } from './templates/i18n/process-summary-notification-statistics.template';
import { DataSource } from 'typeorm';
import { I18nService } from './i18n.service';

export type SendMailInput = {
    to?: string;
    cc?: string;
    bcc?: string;
    subject: string;
    content: string;
    attachments?: { filename: string; path: string; cid?: string }[];
    isHtml: boolean;
};

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly notificationProcessService: NotificationProcessService,
        private readonly notificationBotService: NotificationBotService,
        private readonly serverConfigService: ServerConfigService,
        private readonly i18n: I18nService,
        private readonly dataSource: DataSource,
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

        if (input.attachments && input.attachments.length > 0) {
            sendMailOptions['attachments'] = input.attachments.map((attachment) => ({
                filename: attachment.filename,
                path: attachment.path,
                cid: attachment.cid,
            }));
        }
        
        await this.mailerService.sendMail(sendMailOptions)
            .catch(error => {
                this.logger.error(`Failed to send the mail with error: ${error.message}`);
            });
    }

    public async sendBotDisconnectionNotificationMail(bot: BotEntity, installationId: string) {
        const disconnectedBot = await this.botService.findById(bot.id);
        const botAssignedUserEmail = disconnectedBot.user.email;
        const allSubscriptions = await this.notificationBotService
            .getAllByBotId(disconnectedBot.id);

        const targetSubscribers =
            disconnectedBot.collection.name === DefaultCollections.PUBLIC || disconnectedBot.collection.name === DefaultCollections.GUEST ?
                allSubscriptions :
                allSubscriptions.filter(subscription => disconnectedBot.collection.users.some(user => user.id === subscription.user.id));

        const targetEmails = targetSubscribers
            .map(subscription => this.extractTargetEmailFromNotification(subscription))
            .filter(email => !!email);

        const allEmails = [botAssignedUserEmail, ...targetEmails];

        for (const email of allEmails) {
            const userLang = await this.getUserLanguage(email) as Language;
            const sendMailInput = await this.getBotDisconnectionEmail(installationId, email, userLang);
            
            await this.sendMail(sendMailInput);
        }
    }

    private async getBotDisconnectionEmail(installationId: string, email: string, userLang: Language): Promise<SendMailInput> {
        const subject = this.i18n.translate('mail.botDisconnection.subject', userLang);
        const greeting = this.i18n.translate('mail.botDisconnection.greeting', userLang);
        const message = this.i18n.translate('mail.botDisconnection.botDisconnectedMessage', userLang, { installationId });
        const visitLink = this.i18n.translate('mail.botDisconnection.visitLink', userLang);
        const signature = this.i18n.translate('mail.botDisconnection.signature', userLang);
        
        return {
            to: email,
            subject,
            content: `${greeting},\n\n${message}\n${visitLink} ${this.serverConfigService.entrypointUrl}\n\n${signature}`,
            isHtml: false,
        };
    }

    public async sendProcessFailureNotificationMail(process: IProcess, processInstance: IProcessInstance) {
        const failedProcess = await this.processService.findById(process.id);
        const processCreatorEmail = failedProcess.createdBy.email;
        const allSubscriptions = await this.notificationProcessService
            .getAllByProcessId(failedProcess.id);

        const filteredSubscriptions = failedProcess.isPublic ?
            allSubscriptions :
            allSubscriptions
                .filter(sub => hasRole(sub.user, Role.ROLE_TENANT_ADMIN));

        const targetEmails = filteredSubscriptions
            .map(subscription => this.extractTargetEmailFromNotification(subscription))
            .filter(email => !!email);

        const allEmails = [processCreatorEmail, ...targetEmails];

        for (const email of allEmails) {
            const userLang = await this.getUserLanguage(email) as Language;
            const sendMailInput = await this.getProcessFailureEmail(process, processInstance, email, userLang);
            
            await this.sendMail(sendMailInput);
        }
    }

    private async getProcessFailureEmail(process: IProcess, processInstance: IProcessInstance, email: string, userLang: Language): Promise<SendMailInput> {
        const subject = this.i18n.translate('mail.processFailure.subject', userLang);
        const greeting = this.i18n.translate('mail.processFailure.greeting', userLang);
        const message = this.i18n.translate('mail.processFailure.processFailedMessage', userLang, 
            { processName: process.name, processId: process.id.toString(), status: processInstance.status } 
        );
        const visitLink = this.i18n.translate('mail.processFailure.visitLink', userLang);
        const signature = this.i18n.translate('mail.processFailure.signature', userLang);
        
        return {
            to: email,
            subject,
            content: `${greeting},\n\n${message}\n${visitLink} ${this.serverConfigService.entrypointUrl}/app/processes/${process.id}/run?instanceId=${processInstance.id}\n\n${signature}`,
            isHtml: false,
        };
    }

    public async sendCredentialChangeNotificationMail(params: CredentialChangeMailPayload) {
        const {
            editorEmail,
            collectionCreatorEmail,
            collectionName,
            credentialName,
            credentialOldName,
            operationType,
        } = params;

        const userLang = await this.getUserLanguage(collectionCreatorEmail) as Language;
        
        const oldNameInfo = CredentialOperationType.EDIT && credentialOldName
            ? this.i18n.translate('mail.credentialChange.oldNameInfo', userLang, { oldName: credentialOldName }) : '';

        const messageKey = operationType === CredentialOperationType.CHANGE_ATTRIBUTE 
            ? 'mail.credentialChange.messageWithAttribute'
            : 'mail.credentialChange.messageWithoutAttribute';

        const attributeName = operationType === CredentialOperationType.CHANGE_ATTRIBUTE 
            ? (params as { attributeName: string }).attributeName 
            : '';

        const message = this.i18n.translate(messageKey, 
            userLang,
            { 
                editorEmail, 
                operationType, 
                credentialName, 
                collectionName,
                attributeName,
                oldNameInfo 
            } 
        );

        const sendMailInput: SendMailInput = {
            to: collectionCreatorEmail,
            subject: this.i18n.translate('mail.credentialChange.subject', userLang),
            content: message,
            isHtml: true,
        };

        await this.sendMail(sendMailInput);
    }

    public async sendUserDeclineReasonMail(userToDelete: User, userDto: DeleteUserDto) {
        if (userDto && 'declineReason' in userDto) {
            const userLang = userToDelete.langKey as Language || Language.EN;
            await this.sendMail({
                to: userToDelete.email,
                subject: this.i18n.translate('mail.userActivation.subject', userLang),
                content: userDto.declineReason,
                isHtml: false,
            });
        }
    }

    public async sendUserAcceptMail(userToUpdate: User, message: string) {
        if(message) {
            const userLang = userToUpdate.langKey as Language || Language.EN;
            await this.sendMail({
                to: userToUpdate.email,
                subject: this.i18n.translate('mail.userActivation.subject', userLang),
                content: message,
                isHtml: false,
            });
        }
    }

    public async sendSubscriptionExpirationNotification(user: User, diffDays: number, mailToLink: string) {
        const userLang = user.langKey as Language || Language.EN;
        const emailContent = subscriptionExpirationNotificationTemplate(mailToLink, diffDays, this.i18n, userLang);
        const subject = this.i18n.translate('mail.subscriptionExpiration.subject', userLang);

        await this.sendMail({
            to: user.email,
            subject,
            content: emailContent,
            isHtml: true,
        });
    }

    public async sendProcessSummaryNotification(summaries: { name: string; stats: ProcessStatisticsResult }[], unsubscribeUrl: string, userEmails: string[]) {
        for (const email of userEmails) {
            const userLang = await this.getUserLanguage(email) as Language;
            const emailContent = generateAggregatedEmailContent(summaries, unsubscribeUrl, this.i18n, userLang);
            const subject = this.i18n.translate('mail.processSummary.subject', userLang);

            const sendMailInput: SendMailInput = {
                to: email,
                subject,
                content: emailContent,
                isHtml: true,
            };

            await this.sendMail(sendMailInput);
        }
    }

    private async handleNotificationEmail(emailInput: SendMailInput, addresses: string[]) {
        const emailAddresses = mergeArraysWithoutDuplicates(addresses).join(',');

        await this.sendMail({ ...emailInput, bcc: emailAddresses });
    }

    private extractTargetEmailFromNotification(notification: NotificationBot | NotificationProcess) {
        return notification.customEmail || notification.user?.email || '';
    }

    private async getUserLanguage(userEmail: string): Promise<string> {
        try {
            const user = await this.dataSource
                .createQueryBuilder()
                .select(['user.langKey'])
                .from(User, 'user')
                .where('user.email = :email', { email: userEmail })
                .getOne();
            
            return user?.langKey || 'en';
        } catch (error) {
            this.logger.warn(`Failed to get user language for ${userEmail}, defaulting to 'en'`);
            return 'en';
        }
    }
}

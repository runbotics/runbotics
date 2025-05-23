import { Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { EmailTriggerData, IProcessInstance, isEmailTriggerData, MemoryUnit, TriggerEvent } from 'runbotics-common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { ServerConfigService } from '#/config/server-config';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { QueueService } from '#/queue/queue.service';
import { Logger } from '#/utils/logger';
import { Attachment, OutlookService, Recipient, ReplyEmailRequest } from '../outlook';
import { SubscriptionService } from '../subscription';
import { ExpiredLifecycleNotificationEvent, LifecycleEventDivision, LifecycleNotification, Notification } from './notification.types';
import { TenantService } from '#/scheduler-database/tenant/tenant.service';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly outlookService: OutlookService,
        private readonly processService: ProcessService,
        private readonly queueService: QueueService,
        private readonly serverConfigService: ServerConfigService,
        private readonly subscriptionService: SubscriptionService,
        private readonly tenantService: TenantService,
    ) {}

    async handleEmailNotifications(notifications: (Notification | LifecycleNotification)[]) {
        const emailIds = notifications
            .map(notification => notification.resourceData.id);
        const uniqueEmailIds = [...new Set(emailIds)];

        for (const emailId of uniqueEmailIds) {
            const email = await this.outlookService.getEmail(emailId);

            const processId = Number(email.subject);
            if (Number.isNaN(processId)) {
                throw new Error('Incorrect email subject. Must be valid process ID.');
            }

            try {
                const process = await this.processService.findById(processId);
                if (!process) {
                    const message = `Cannot find process with ID "${email.subject}".`;
                    this.logger.error(message);
                    throw new NotFoundException(message);
                }

                const tenant = await this.tenantService.getById(process.tenantId);
                const whitelist = tenant.emailTriggerWhitelist.map(item => item.whitelistItem);
                if (!this.isSenderAllowed(email.sender.emailAddress.address, whitelist)) {
                    this.logger.warn(`Notification is not a valid email trigger email - skipping (emailId=${emailId})`);
                    continue;
                }

                await this.queueService.validateProcessAccess({
                    process,
                    triggered: true,
                    user: {
                        tenantId: process.tenantId,
                        authorities: [],
                    },
                });

                const variables = this.parseMailBody(email.bodyPreview);

                if (email.hasAttachments) {
                    const attachments = (await this.outlookService.getAttachments(email.id)).value;
                    attachments.forEach((attachment) => {
                        if (!this.isFileSizeAllowed(attachment.size)) {
                            throw new PayloadTooLargeException(
                                `Cannot start the process "${processId}". Uploaded attachment is too large (max 4MB).`
                            );
                        }
                        const { filename, fileContent } = this.mapAttachment(attachment);
                        variables[filename] = fileContent;
                    });
                }

                variables['senderEmailAddress'] = email.sender.emailAddress.address.toLowerCase();

                const input = { variables };

                const ccRecipients = email.ccRecipients
                    .map(recipient => recipient.emailAddress.address.toLowerCase());
                const bccRecipients = email.bccRecipients
                    .map(recipient => recipient.emailAddress.address.toLowerCase());

                await this.queueService.createInstantJob({
                    process,
                    input,
                    user: process.createdBy,
                    trigger: { name: TriggerEvent.EMAIL },
                    triggerData: {
                        emailId,
                        sender: email.sender.emailAddress.address.toLowerCase(),
                        ...(ccRecipients.length && { ccRecipients }),
                        ...(bccRecipients.length && { bccRecipients }),
                    } as EmailTriggerData,
                });

            } catch (e: any) {
                const replyEmail: ReplyEmailRequest = {
                    message: {
                        toRecipients: [email.sender],
                        ccRecipients: email.ccRecipients,
                        bccRecipients: email.bccRecipients,
                    },
                    comment: e.message,
                };

                this.logger.error(e.message);
                await this.outlookService.replyEmail(email.id, replyEmail)
                    .catch(error => {
                        this.logger.error(`Error while sending reply to ${email.sender.emailAddress.address} (${email.id})`, error);
                    });
            }
        }
    }

    async sendProcessResultMail(processInstance: IProcessInstance) {
        if (processInstance.trigger.name !== TriggerEvent.EMAIL
            || !isEmailTriggerData(processInstance.triggerData)) {
            return;
        }

        const mapRecipients = (addresses?: string[]): Recipient[] => addresses
            ? addresses
                .map(address => ({
                    emailAddress: {
                        address: address,
                    },
                }))
            : undefined;

        const processUrl = `${this.serverConfigService.entrypointUrl}/app/processes/${processInstance.process.id}/run`;

        const replyEmail: ReplyEmailRequest = {
            message: {
                toRecipients: [{
                    emailAddress: {
                        address: processInstance.triggerData.sender,
                    },
                }],
                ccRecipients: mapRecipients(processInstance.triggerData.ccRecipients),
                bccRecipients: mapRecipients(processInstance.triggerData.bccRecipients),
            },
            comment: `Process finished with status ${processInstance.status}. See more details at ${processUrl}`,
        };

        await this.outlookService.replyEmail(processInstance.triggerData.emailId, replyEmail)
            .catch(error => {
                const triggerData = processInstance.triggerData as EmailTriggerData;
                this.logger.error(`Error while sending reply to ${triggerData.sender} (${triggerData.emailId})`, error);
            });
    }

    async handleLifecycleEmailNotifications(notifications: LifecycleNotification[]) {
        const { missed, expired } = this.divideByType(notifications);

        await Promise.allSettled([
            this.handleEmailNotifications(missed),
            this.handleExpiredEmailNotifications(expired),
        ]);
    }

    async handleExpiredEmailNotifications(notifications: ExpiredLifecycleNotificationEvent[]) {
        const newSubscriptionExpirationDate = {
            expirationDateTime: dayjs.utc().add(2, 'days').format(),
        };
        await Promise.allSettled(notifications
            .map(notification => this.subscriptionService
                .updateSubscription(notification.subscriptionId, newSubscriptionExpirationDate)));
    }

    private isSenderAllowed(address: string, emailTriggerWhitelist: string[]) {
        if (emailTriggerWhitelist.length === 0) return false;

        const senderDomain = address.toLocaleLowerCase().split('@')[1];
        const isEmailOnWhitelist = emailTriggerWhitelist.includes(address.toLocaleLowerCase());
        const isDomainOnWhitelist = emailTriggerWhitelist.includes(senderDomain);

        return isEmailOnWhitelist || isDomainOnWhitelist;
    }

    private mapAttachment(attachment: Attachment) {
        const filename = attachment.name
            .split('.')
            .slice(0, -1)
            .join('');

        const fileSection = `filename:${filename}`;
        const contentTypeSection = `data:${attachment.contentType}`;
        const baseSection = `base64,${attachment.contentBytes}`; // contentBytes is content of the file, comes already in base64
        const fileContent = [fileSection, contentTypeSection, baseSection].join(';');

        return {
            filename,
            fileContent,
        };
    }

    private divideByType(notifications: LifecycleNotification[]): LifecycleEventDivision {
        return notifications.reduce((acc, notification) => {
            if (notification.lifecycleEvent === 'reauthorizationRequired')
                acc.expired.push(notification);
            if (notification.lifecycleEvent === 'missed')
                acc.missed.push(notification);
            return acc;
        }, { missed: [], expired: [] });
    }

    private parseMailBody(text: string): unknown {
        return {};
        // @todo enable getting process variables from email attachment "variables.txt"
        // return text
        //     ?.split(/\r?\n/)
        //     .reduce((acc, line, index) => {
        //         if (!line) return acc;
        //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //         const [key, value, _] = line.split('=');
        //         if (!key || !value)
        //             throw new Error(`Invalid variable format at line ${index + 1}`);
        //         acc[key.trim()] = value.trim().replace(/['"]/g, '');
        //         return acc;
        //     }, {});
    }

    private isFileSizeAllowed(size: number) {
        const MAX_FILE_SIZE = MemoryUnit.MB * 4;
        return size <= MAX_FILE_SIZE;
    }
}

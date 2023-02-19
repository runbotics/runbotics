import { Injectable } from '@nestjs/common';
import { IProcessInstance, ProcessTrigger } from 'runbotics-common';
import { ProcessService } from 'src/database/process/process.service';
import { QueueService } from 'src/queue/queue.service';
import { Logger } from 'src/utils/logger';
import { OutlookService, ReplyEmailRequest } from '../outlook';
import { Notification } from './notification.types';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    /**
         * 1. pobierz email
         * 2. czy tytuł pokrywa się z jakimś id procesu?
         * 3. pobierz proces
         * 4. czy triggerable?
         * 5. czy attended?
         * 6. sprawdz czy ma załączniki (jesli istnieją nazwy od razu to waliduj attended a potem je pobierz)
         * 7. startuj proces
    */

    /** CHANGELOG
     * 1. dodac kolumne trigger_info (jsonb?) 
        * 1) emailID - string/null
        * 2) sender email - string
        * 3) cc emails - string
        * 4) bcc emails -string
     * 2. nadać sender email z triggered_by
     * 3. wywlić kolumne triggered_by z process_instance 
     */

    constructor(
        private readonly outlookService: OutlookService,
        private readonly processService: ProcessService,
        private readonly queueService: QueueService,
    ) {}

    async handleEmailNotifications(notifications: Notification[]) {
        const emailIds = notifications
            .map(notification => notification.resourceData.id);
        const uniqueEmailIds = [...new Set(emailIds)];

        for (const emailId of uniqueEmailIds) {
            const email = await this.outlookService.getEmail(emailId);

            try {
                const process = await this.validateTitle(email.subject);
                const variables = this.parseMailBody(email.bodyPreview);
    
                if (email.hasAttachments) {
                    const attachments = (await this.outlookService.getAttachments(email.id)).value;
                    attachments.forEach((attachment) => {
                        variables[attachment.name] = Buffer.from(attachment.contentBytes).toString();
                    });
                }

                const input = { variables };

                await this.queueService.createInstantJob({
                    process,
                    input,
                    user: null,
                    trigger: ProcessTrigger.EMAIL,
                    triggeredBy: email.sender.emailAddress.address.toLowerCase(),
                });

            } catch (e) {
                const replyEmail: ReplyEmailRequest = {
                    message: { 
                        toRecipients: [email.sender],
                        ccRecipients: email.ccRecipients,
                        bccRecipients: email.bccRecipients,
                    },
                    comment: e.message + '\r\n',
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
        if (processInstance.trigger.name !== ProcessTrigger.EMAIL
            || !processInstance.triggeredBy) {
            return;
        }

        const replyEmail: ReplyEmailRequest = {
            message: { 
                toRecipients: [{
                    emailAddress: {
                        address: processInstance.triggeredBy,
                    },
                }],
                ccRecipients: email.ccRecipients,
            },
            comment: '',
        };
        
        await this.outlookService.replyEmail(email.id, replyEmail)
            .catch(error => {
                this.logger.error(`Error while sending reply to ${email.sender.emailAddress.address} (${email.id})`, error);
            });
    }

    private async validateTitle(title: string) {
        const processId = Number(title);

        const message = `Process "${title}" does not exist`;
        if (Number.isNaN(processId)) {
            this.logger.error(message);
            throw new Error(message);
        }

        const process = await this.processService.findById(processId);

        if (!process) {
            this.logger.error(message);
            throw new Error(message);
        }

        await this.queueService.validateProcessAccess({ process, triggered: true });

        return process;
    }

    private parseMailBody(text: string): unknown {
        return text
            ?.split(/\r?\n/)
            .reduce((input, line, index) => {
                if (!line) return input;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [key, value, _] = line.split('=');
                if (!key || !value)
                    throw new Error(`Invalid variable format at line ${index + 1}`);
                input[key.trim()] = value.trim().replace(/['"]/g, '');
                return input;
            }, {});
    }
}

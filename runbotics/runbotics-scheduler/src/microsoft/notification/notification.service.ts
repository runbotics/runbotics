import { Injectable } from '@nestjs/common';
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
                await this.validateTitle(email.subject);
                const input = this.parseMailBody(email.bodyPreview);
    
                if (email.hasAttachments) {
                    const attachments = (await this.outlookService.getAttachments(email.id)).value;
                    attachments.forEach((attachment) => {
                        input[attachment.name] = attachment.contentBytes;
                    });
                }
            } catch (e) {
                const replyEmail: ReplyEmailRequest = {
                    message: { 
                        toRecipients: [email.sender],
                        ccRecipients: email.ccRecipients,
                    },
                    comment: e.message + '\r\n',
                };
                
                this.logger.error(e.message);
                await this.outlookService.replyEmail(email.id, replyEmail)
                    .catch(error => {
                        this.logger.error(`Error while sending reply to ${email.sender.emailAddress.address} (${email.id})`, error);
                    });
                continue;
            }
        }
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

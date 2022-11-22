import { Injectable, NotFoundException } from '@nestjs/common';
import { FetchQueryObject, ImapFlow, MessageEnvelopeObject } from 'imapflow';
import { Logger } from 'src/utils/logger';
import { Attachment, simpleParser } from 'mailparser';
import { ProcessService } from 'src/database/process/process.service';
import { createTransport, Transporter, SentMessageInfo} from 'nodemailer';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { QueueService } from 'src/queue/queue.service';
import { Cron } from '@nestjs/schedule';

const FETCH_MAILS_CONFIG: FetchQueryObject = {
    source: true,
    uid: true,
    envelope: true,
    bodyStructure: true,
    headers: true,
    labels: true,
    flags: true,
};

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private client: ImapFlow;
    private server: Transporter<SentMessageInfo>;

    constructor(
        private readonly processService: ProcessService,
        private readonly serverConfigService: ServerConfigService,
        private readonly queueService: QueueService
    ) {}

    private initializeServices() {
        this.client = new ImapFlow({
            ...this.serverConfigService.readEmailConfig,
            secure: true,
            tls: {
                rejectUnauthorized: false
            },
            logger: false,
        });

        this.server = createTransport({
            ...this.serverConfigService.sendEmailConfig,
            secure: true
        });
    }

    @Cron('0 * * * * *')
    private async readMailbox() {
        this.initializeServices();
        this.logger.log('>> CONNECTING TO MAILBOX');
        await this.client.connect();
        this.logger.log('MAILBOX CONNECTED');
        
        const lock = await this.client.getMailboxLock('INBOX');
        await this.client.mailboxOpen('INBOX');

        const processedMails: number[] = [];
        
        try {
            const messages = await this.client.fetch({ seen: false }, FETCH_MAILS_CONFIG);

            for await (const msg of messages) {
                try {
                    if (!this.hasTriggerAccess(msg.envelope.from[0].address)) {
                        continue;
                    }

                    this.logger.log(`PROCESSING EMAIL ${msg.uid}: "${msg.envelope.subject}" FROM ${msg.envelope.from.map(x => x.address)} | ${msg.envelope.date.toLocaleString()}`);
                    processedMails.push(msg.uid);

                    const process = await this.validateTitle(msg.envelope);
                    const variables = await this.extractMailBody(msg.source);
                    
                    const input = { variables };

                    await this.queueService.createInstantJob({ process, user: null, input });
                } catch (error) {
                    this.logger.error(error.message, error);
                    await this.sendReplyMail(msg.envelope, error.message);
                }
            }

            if (processedMails.length) {
                this.logger.log('MAILS PROCESSED: ', processedMails);
            } else {
                this.logger.log('NO MAILS PROCESSED ');
            }

            await this.client.messageFlagsAdd(processedMails, ['\\Seen']);
        } finally {
            await this.client.mailboxClose();
            lock.release();
            await this.client.logout();
            this.logger.log('<< MAILBOX DISCONNECTED');
        }

    }

    private async validateTitle(envelope: MessageEnvelopeObject) {
        const process = await this.processService.findByInfo(envelope.subject);

        if (!process) {
            this.logger.error(`Process "${envelope.subject}" does not exist`);
            throw new NotFoundException(`Process "${envelope.subject}" does not exist`);
        }

        await this.queueService.validateProcessAccess({ process, triggered: true });

        return process;
    }

    private sendReplyMail(envelope: MessageEnvelopeObject, text: string) {
        return this.server.sendMail({
            from: envelope.to[0].address,
            to: envelope.from[0].address,
            replyTo: envelope.replyTo[0].address,
            inReplyTo: envelope.messageId,
            subject: envelope.subject,
            references: envelope.messageId,
            text: `Error running process ${envelope.subject}\n\n${text}`,
        });
    }

    private async extractMailBody(body: Buffer) {
        try {
            const parsed = await simpleParser(body);
            const input = this.parseMailBody(parsed.text);
            return {
                ...input,
                ...this.extractAttachments(parsed.attachments)
            };
        } catch (error) {
            this.logger.error(`Wrong body format: ${error.message}`);
            throw new Error(`Wrong body format: ${error.message}`);
        }
    }

    private extractAttachments(attachments: Attachment[]) {
        return attachments.reduce((acc, att) => {
            const filename = att.filename.split('.').slice(0, -1).join('');
            acc[filename] = `data:${att.contentType};base64,'${att.content.toString('base64')}`;
            return acc;
        }, {});
    }

    private parseMailBody(text: string) {
        return text
            .split(/\r?\n/)
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

    private hasTriggerAccess(emailAdress: string) {
        return emailAdress.includes('@all-for-one.com');
    }

} 

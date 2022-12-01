import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FetchQueryObject, ImapFlow, MessageEnvelopeObject } from 'imapflow';
import { Logger } from 'src/utils/logger';
import { Attachment, simpleParser } from 'mailparser';
import { ProcessService } from 'src/database/process/process.service';
import { createTransport, Transporter, SentMessageInfo} from 'nodemailer';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { QueueService } from 'src/queue/queue.service';
import { Cron } from '@nestjs/schedule';
import { ProcessTrigger } from 'runbotics-common';

const FETCH_MAILS_CONFIG: FetchQueryObject = {
    source: true,
    uid: true,
    envelope: true,
    bodyStructure: true,
    headers: true,
    labels: true,
    flags: true,
};

const DEFAULT_MAILBOX = 'INBOX';

@Injectable()
export class MailService implements OnModuleInit {
    private readonly logger = new Logger(MailService.name);
    private client: ImapFlow;
    private server: Transporter<SentMessageInfo>;

    constructor(
        private readonly processService: ProcessService,
        private readonly serverConfigService: ServerConfigService,
        private readonly queueService: QueueService
    ) {}

    onModuleInit() {
        if (!this.serverConfigService.sendEmailConfig.host || !this.serverConfigService.sendEmailConfig.port) {
            throw new Error('Wrong smtp mail config');
        }

        this.server = createTransport({
            ...this.serverConfigService.sendEmailConfig,
            secure: true
        });
    }

    private initializeServices() {
        if (!this.serverConfigService.readEmailConfig.host || !this.serverConfigService.readEmailConfig.port) {
            throw new Error('Wrong imap mail config');
        }

        if (!this.serverConfigService.sendEmailConfig.host || !this.serverConfigService.sendEmailConfig.port) {
            throw new Error('Wrong smtp mail config');
        }

        this.client = new ImapFlow({
            ...this.serverConfigService.readEmailConfig,
            secure: true,
            tls: {
                rejectUnauthorized: false
            },
            logger: false,
        });
    }

    @Cron('0 * * * * *')
    private async readMailbox() {
        this.logger.log('>> Connecting to mailbox');

        try {
            this.initializeServices();
        } catch (error) {
            this.logger.error(error.message);
            return;
        }

        await this.client.connect()
            .then(() => {
                this.logger.log('Success: Mailbox connected');
            })
            .catch(error => {
                this.logger.error('Mail imap connection error: ', error);
                throw new Error(error.message);
            });

        
        const lock = await this.client.getMailboxLock(DEFAULT_MAILBOX);
        await this.client.mailboxOpen(DEFAULT_MAILBOX);

        const processedMails: number[] = [];
        
        try {
            const messages = await this.client.fetch({ seen: false }, FETCH_MAILS_CONFIG);

            for await (const msg of messages) {
                try {
                    if (!this.hasTriggerAccess(msg.envelope.from[0].address)) {
                        continue;
                    }

                    const sender = msg.envelope.from.map(x => x.address)[0];

                    this.logger.log(`Processing email ${msg.uid}: "${msg.envelope.subject}" from ${sender} | ${msg.envelope.date.toLocaleString()}`);
                    processedMails.push(msg.uid);

                    const process = await this.validateTitle(msg.envelope);
                    const variables = await this.extractMailBody(msg.source);
                    
                    const input = { variables };

                    await this.queueService.createInstantJob({
                        process,
                        input,
                        user: null,
                        trigger: ProcessTrigger.EMAIL,
                        triggeredBy: sender.toLowerCase(),
                    });
                } catch (error) {
                    this.logger.error(error.message, error);
                    await this.sendReplyErrorMail(msg.envelope, error.message);
                }
            }

            if (processedMails.length) {
                this.logger.log('Mails processsed: ', processedMails);
            } else {
                this.logger.log('No mails processed ');
            }

            await this.client.messageFlagsAdd(processedMails, ['\\Seen']);
        } finally {
            await this.client.mailboxClose();
            lock.release();
            await this.client.logout();
            this.logger.log('<< Mailbox disconnected');
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

    private sendReplyErrorMail(envelope: MessageEnvelopeObject, text: string) {
        return this.server.sendMail({
            from: envelope.to[0].address,
            to: envelope.from[0].address,
            replyTo: envelope.replyTo[0].address,
            inReplyTo: envelope.messageId,
            subject: envelope.subject,
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
            acc[filename] = `filename:${filename};data:${att.contentType};base64,'${att.content.toString('base64')}`;
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

import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { FetchQueryObject, ImapFlow, MessageEnvelopeObject } from 'imapflow';
import { Logger } from 'src/utils/logger';
import { Attachment, simpleParser } from 'mailparser';
import { ProcessService } from 'src/database/process/process.service';
import { createTransport, Transporter, SentMessageInfo} from 'nodemailer';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { QueueService } from 'src/queue/queue.service';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { IProcessInstance, ProcessInstanceStatus, ProcessTrigger } from 'runbotics-common';

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
const EVERY_MINUTE_CRON = '0 * * * * *';
const SEEN_FLAG = '\\Seen';
const AUTHORISED_DOMAIN = 'all-for-one.com';
const EMAIL_TRIGGER_CRON_JOB_NAME = 'email_trigger';

@Injectable()
export class MailService implements OnModuleInit {
    private readonly logger = new Logger(MailService.name);
    private client: ImapFlow;
    private server: Transporter<SentMessageInfo>;

    constructor(
        private readonly processService: ProcessService,
        private readonly serverConfigService: ServerConfigService,
        private readonly queueService: QueueService,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) {}

    public onModuleInit() {
        try {
            this.checkMailConfig();
        } catch (e) {
            this.logger.error(e);
            return;
        }

        this.server = createTransport({
            ...this.serverConfigService.sendEmailConfig,
            secure: true
        });
    }

    private initializeServices() {
        this.client = new ImapFlow({
            ...this.serverConfigService.readEmailConfig,
            secure: true,
            tls: {
                rejectUnauthorized: false
            },
            logger: false,
        });
    }

    private checkMailConfig() {
        if (!this.serverConfigService.readEmailConfig.auth.user || !this.serverConfigService.readEmailConfig.auth.pass) {
            throw new Error('Missing mail auth config: Email trigger won\'t be available');
        }

        if (!this.serverConfigService.readEmailConfig.host || !this.serverConfigService.readEmailConfig.port) {
            throw new Error('Missing imap mail config: Email trigger won\'t be available');
        }

        if (!this.serverConfigService.sendEmailConfig.host || !this.serverConfigService.sendEmailConfig.port) {
            throw new Error('Missing smtp mail config: Email trigger won\'t be available');
        }
    }

    private isMailConfigProvided() {
        return this.serverConfigService.sendEmailConfig.host && this.serverConfigService.sendEmailConfig.port
            && this.serverConfigService.readEmailConfig.host && this.serverConfigService.readEmailConfig.port
            && this.serverConfigService.readEmailConfig.auth.user && this.serverConfigService.readEmailConfig.auth.pass;
    }

    @Cron(EVERY_MINUTE_CRON, { name: EMAIL_TRIGGER_CRON_JOB_NAME })
    private async readMailbox() {
        if (!this.isMailConfigProvided()) {
            this.schedulerRegistry.deleteCronJob(EMAIL_TRIGGER_CRON_JOB_NAME);
            return;
        }

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

            await this.client.messageFlagsAdd(processedMails, [SEEN_FLAG]);
        } finally {
            await this.client.mailboxClose();
            lock.release();
            await this.client.logout();
            this.logger.log('<< Mailbox disconnected');
        }
    }

    public async sendProcessResultMail(processInstance: IProcessInstance) {
        if (!processInstance.triggeredBy) return;

        await this.server.sendMail({
            from: this.serverConfigService.sendEmailConfig.auth.user,
            to: processInstance.triggeredBy,
            subject: `Re: ${processInstance.process.id}`,
            text: this.getProcessResultMailText(processInstance),
        });
    }

    private getProcessResultMailText(processInstance: IProcessInstance) {
        if (processInstance.status === ProcessInstanceStatus.ERRORED) {
            return `An error occured during process ${processInstance.process.id} execution:\n\n` + processInstance.error;
        }
        
        if (processInstance.status === ProcessInstanceStatus.TERMINATED) {
            return `Process ${processInstance.process.id} execution was terminated`;
        }

        return `Process ${processInstance.process.id} execution has been completed successfully`;
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
        return emailAdress.includes(`@${AUTHORISED_DOMAIN}`);
    }

} 

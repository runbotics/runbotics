/* eslint-disable no-useless-escape */
import { Injectable, NotFoundException } from '@nestjs/common';
import { FetchQueryObject, ImapFlow, MessageEnvelopeObject } from 'imapflow';
import { Logger } from 'src/utils/logger';
import { simpleParser } from 'mailparser';
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
        this.logger.log('CONNECTING TO MAILBOX');
        await this.client.connect();
        this.logger.log('MAILBOX CONNECTED');
        
        const lock = await this.client.getMailboxLock('INBOX');
        const mailbox = await this.client.mailboxOpen('INBOX');

        const processedMails: number[] = [];
        
        try {
            const messages = await this.client.fetch({ seen: false }, FETCH_MAILS_CONFIG);

            for await (const msg of messages) { 
                try {
                    this.logger.log(`PROCESSING EMAIL ${msg.uid}: "${msg.envelope.subject}" FROM ${msg.envelope.from.map(x => x.address)} | ${msg.envelope.date.toLocaleString()}`);
                    processedMails.push(msg.uid);

                    const process = await this.validateTitle(msg.envelope);
                    const attendedVariables = await this.extractMailBody(msg.source);
                    
                    const input = {
                        variables: attendedVariables
                    };

                    await this.queueService.createInstantJob({ process, user: null, input });
                } catch (error) {
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
            this.logger.log('MAILBOX DISCONNECTED');
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
            inReplyTo: envelope.inReplyTo,
            subject: `RE: ${envelope.subject}`,
            text
        });
    }

    private async extractMailBody(body: Buffer) {
        try {
            const parsed = await simpleParser(body);
            const jsonBody = JSON.parse(parsed.text); 
            return jsonBody;
        } catch (error) {
            this.logger.error(`Wrong JSON body format: ${error.message}`);
            throw new Error(`Wrong JSON body format: ${error.message}`);
        }
    }

} 

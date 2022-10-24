/* eslint-disable no-useless-escape */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { Logger } from 'src/utils/logger';
import { simpleParser } from 'mailparser';

const client = new ImapFlow({
    host: 'imap.poczta.onet.pl',
    port: 993,
    secure: true,
    auth: {
        user: 'rbbbb@op.pl',
        pass: 'Runbotics123!@#'
    },
    tls: {
        rejectUnauthorized: false
    },
    logger: false,
});

@Injectable()
export class MailService implements OnModuleInit {
    private readonly logger = new Logger(MailService.name);

    async onModuleInit() {
        await this.readMailbox();
    }

    private async readMailbox() {
        this.logger.log('CONNECTING TO MAILBOX');
        await client.connect();
        this.logger.log('MAILBOX CONNECTED');

        const lock = await client.getMailboxLock('INBOX');
        const mailbox = await client.mailboxOpen('INBOX');
        
        try {
            const messages = await client.fetch({ all: true }, {
                source: true,
                uid: true,
                envelope: true,
                bodyStructure: true,
                headers: true,
                labels: true,
                flags: true,
            });
            for await (const msg of messages) { 
                this.logger.log(`NEW EMAIL: "${msg.envelope.subject}" FROM ${msg.envelope.from.map(x => x.address)} ${msg.envelope.date}`);
                this.logger.log('FLAGS: ', msg.flags);
                this.logger.log('Validation');
                this.logger.log('STARTING NEW PROCESS');
                // const isFlagAdded = await client.messageFlagsAdd({ seen: false, seq: msg.seq.toString() }, ['\\Seen'], { uid: true });
                // this.logger.log('DONE', isFlagAdded); 
            }
            // const parsed = await simpleParser(message);
            // const jsonBody = JSON.parse(parsed.text); 
            // this.logger.log('MESSAGE SOURCE: ', message.source.toString()); 
            // const source = new TextDecoder().decode(message.source);
            // this.logger.log(source);
            
        } finally {
            await client.mailboxClose();
            lock.release();
        }

        await client.logout();
    }

} 
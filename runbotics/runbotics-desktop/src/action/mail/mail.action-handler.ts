import { Injectable } from '@nestjs/common';
import { StatelessActionHandler, DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { MailService } from '#mailer/mailer.service';
import { ServerConfigService } from '#config';
import { MailCredential } from './mail.types';
import fs from 'fs';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import path from 'path';

export type MailActionRequest =
    | DesktopRunRequest<'mail.send', MailSendActionInput>;

export type MailSendActionInput = {
    to: string;
    cc?: string;
    subject: string;
    content: string;
    attachment?: string;
};
export type MailSendActionOutput = any;

@Injectable()
export default class MailActionHandler extends StatelessActionHandler {

    constructor(
        private readonly serverConfigService: ServerConfigService,
        private readonly mailService: MailService,
    ) {
        super();
    }

    async sendMail(input: MailSendActionInput, credential: MailCredential): Promise<MailSendActionOutput> {
        const regex1 = new RegExp('&lt;');
        const regex2 = new RegExp('&gt;');
        let content = input.content;
        while (content.search(regex1) !== -1) {
            content = content.replace(regex1, '<');
            content = content.replace(regex2, '>');
        }

        const attachment = input.attachment;
        if (attachment) {
            const ext = path.extname(attachment);
            const baseName = path.basename(attachment, ext);
            const fileName = `${baseName}${ext}`;
            await this.mailService.sendMail(
                {
                    to: input.to,
                    cc: input.cc,
                    from: credential.mailUsername,
                    subject: input.subject,
                    html: content,
                    attachments: [
                        {
                            // buffer as an attachment
                            filename: fileName,
                            content: fs.readFileSync(attachment),
                        },
                    ],
                },
                credential,
            );
        } else {
            await this.mailService.sendMail(
                {
                    to: input.to,
                    cc: input.cc,
                    from: credential.mailUsername,
                    subject: input.subject,
                    html: content,
                },
                credential,
            );
        }
        return {};

    }

    run(request: MailActionRequest) {
        const matchedCredential =
            credentialAttributesMapper<MailCredential>(request.credentials);

        const mailCredential: MailCredential = matchedCredential;

        switch (request.script) {
            case 'mail.send':
                return this.sendMail(request.input, mailCredential);
            default:
                throw new Error('Action not found');
        }
    }
}

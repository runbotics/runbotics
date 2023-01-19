import { Injectable } from '@nestjs/common';
import { StatelessActionHandler, DesktopRunRequest, DesktopRunResponse } from 'runbotics-sdk';
import { MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';

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
    constructor(private readonly mailerService: MailerService) {
        super();
    }

    async sendMail(input: MailSendActionInput): Promise<MailSendActionOutput> {
        const regex1 = new RegExp('&lt;');
        const regex2 = new RegExp('&gt;');
        let content = input.content;
        while (content.search(regex1) !== -1) {
            content = content.replace(regex1, '<');
            content = content.replace(regex2, '>');
        }

        const attachment = input.attachment;
        if (attachment) {
            const fileName = attachment.substring(attachment.lastIndexOf('\\') + 1);
            await this.mailerService.sendMail({
                to: input.to,
                cc: input.cc,
                from: process.env.MAIL_USERNAME, // sender address
                subject: input.subject,
                // text: input.content, // plaintext body
                html: content, // HTML body content
                attachments: [
                    {
                        // buffer as an attachment
                        filename: fileName,
                        content: fs.readFileSync(attachment),
                    },
                ],
            });
        } else {
            await this.mailerService.sendMail({
                to: input.to,
                cc: input.cc,
                from: process.env.MAIL_USERNAME, // sender address
                subject: input.subject,
                // text: input.content, // plaintext body
                html: content, // HTML body content
            });
        }
        return {};
    }

    run(request: MailActionRequest) {
        switch (request.script) {
            case 'mail.send':
                return this.sendMail(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}

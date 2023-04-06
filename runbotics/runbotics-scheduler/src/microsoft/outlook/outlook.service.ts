import { Injectable } from '@nestjs/common';
import { Logger } from '#/utils/logger';

import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service';
import { Email, GetAttachmentsResponse, GetAllEmailsResponse, ReplyEmailRequest, SendEmailRequest } from './outlook.types';

interface EmailRequestParameters {
    unread?: boolean;
}

@Injectable()
export class OutlookService {
    private readonly logger = new Logger(OutlookService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    // https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=javascript
    getEmails(params?: EmailRequestParameters) {
        const filters = [];
        if (params?.unread)
            filters.push('isRead eq false');
        
        return this.microsoftGraphService
            .get<GetAllEmailsResponse>('/me/messages', { filter: filters.join(' and ')});
    }

    // https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=javascript
    getEmail(emailId: string) {
        return this.microsoftGraphService
            .get<Email>(`/me/messages/${emailId}`);
    }

    // https://learn.microsoft.com/en-us/graph/api/message-list-attachments?view=graph-rest-1.0&tabs=javascript
    getAttachments(emailId: string) {
        return this.microsoftGraphService
            .get<GetAttachmentsResponse>(`/me/messages/${emailId}/attachments`);
    }

    // https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0&tabs=javascript
    sendEmail(email: SendEmailRequest) {
        return this.microsoftGraphService
            .post<void>('/me/sendMail', email);
    }

    // https://learn.microsoft.com/en-us/graph/api/message-reply?view=graph-rest-1.0&tabs=javascript
    replyEmail(emailId: string, email: ReplyEmailRequest) {
        return this.microsoftGraphService
            .post<void>(`/me/messages/${emailId}/reply`, email);
    }

}

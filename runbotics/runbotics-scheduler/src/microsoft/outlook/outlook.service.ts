import { Injectable } from '@nestjs/common';
import { Logger } from 'src/utils/logger';

import { MicrosoftGraphService } from '../microsoft-graph.service';
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
    getEmails(params?: EmailRequestParameters): Promise<GetAllEmailsResponse> {
        const request = this.microsoftGraphService.api('/me/messages');

        if (params) {
            const filters = [];
            if (params.unread) {
                filters.push('isRead eq false');
            }
            return request
                // https://learn.microsoft.com/en-us/graph/filter-query-parameter?tabs=javascript
                .filter(filters.join(' and '))
                .get();
        }
        
        return request.get();
    }

    // https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=javascript
    getEmail(emailId: string): Promise<Email> {
        return this.microsoftGraphService.api(`/me/messages/${emailId}`)
            .get();
    }

    // https://learn.microsoft.com/en-us/graph/api/message-list-attachments?view=graph-rest-1.0&tabs=javascript
    getAttachments(emailId: string): Promise<GetAttachmentsResponse> {
        return this.microsoftGraphService.api(`/me/messages/${emailId}/attachments`)
            .get();
    }

    // https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0&tabs=javascript
    sendEmail(email: SendEmailRequest): Promise<void> {
        return this.microsoftGraphService.api('/me/sendMail')
            .post(email);
    }

    // https://learn.microsoft.com/en-us/graph/api/message-reply?view=graph-rest-1.0&tabs=javascript
    replyEmail(emailId: string, email: ReplyEmailRequest) {
        return this.microsoftGraphService.api(`/me/messages/${emailId}/reply`)
            .post(email);
    }

}

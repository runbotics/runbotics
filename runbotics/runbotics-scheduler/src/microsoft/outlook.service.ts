import { Injectable, OnModuleInit } from '@nestjs/common';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { Logger } from 'src/utils/logger';

// required by microsoft-graph-client
import 'cross-fetch/polyfill';
import { MicrosoftGraphClient } from './microsoft-graph-client';

interface EmailRequestParameters {
    unread?: boolean;
}

@Injectable()
export class OutlookService extends MicrosoftGraphClient {
    private readonly logger = new Logger(OutlookService.name);

    constructor(
        readonly microsoftAuthService: MicrosoftAuthService,
    ) {
        super(microsoftAuthService);
    }

    // https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview?view=graph-rest-1.0
    getEmails(params?: EmailRequestParameters) {
        const request = this.client.api('/me/messages');

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

    // value: [
    // {
    //     id: '9c38edde-9ad9-4a19-917f-159884c1ab3c',
    //     resource: "me/mailFolders('Inbox')/messages",
    //     applicationId: 'ac4150e9-dbcc-4c09-acda-456b472d73fb',
    //     changeType: 'created',
    //     clientState: null,
    //     notificationUrl: 'https://40b8-77-65-92-165.eu.ngrok.io/scheduler/notifications/email',
    //     notificationQueryOptions: null,
    //     lifecycleNotificationUrl: 'https://40b8-77-65-92-165.eu.ngrok.io/scheduler/notifications/email/lifecycle',
    //     expirationDateTime: '2023-02-12T23:09:56Z',
    //     creatorId: '7bfedfd7-f4c7-45f7-8156-0e40678f614e',
    //     includeResourceData: null,
    //     latestSupportedTlsVersion: 'v1_2',
    //     encryptionCertificate: null,
    //     encryptionCertificateId: null,
    //     notificationUrlAppId: null
    //   }
    // ]
}

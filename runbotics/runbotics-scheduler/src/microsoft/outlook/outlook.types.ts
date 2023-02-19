interface Recipient {
    emailAddress: {
        name?: string;
        address: string;
    };
}

export interface Email {
    '@odata.context': string;
    '@odata.etag': string;
    id: string;
    createdDateTime: string;
    lastModifiedDateTime: string;
    changeKey: string;
    categories: string[];
    receivedDateTime: string;
    sentDateTime: string;
    hasAttachments: boolean;
    internetMessageId: string;
    subject: string;
    bodyPreview: string;
    conversationId: string;
    isDeliveryReceiptRequested: boolean;
    isReadReceiptRequested: boolean;
    isRead: boolean;
    isDraft: boolean;
    webLink: string;
    inferenceClassification: string;
    body: {
        contentType: 'Text' | 'HTML';
        content: string;
    };
    importance: string;
    parentFolderId: string;

    sender: Recipient;
    from: Recipient;
    bccRecipients: Recipient[];
    toRecipients: Recipient[];
    ccRecipients: Recipient[];
    replyTo: Recipient[];
    flag: {
        flagStatus: string;
    };
}

interface Attachment {
    '@odata.type': string;
    id: string;
    contentType: string;
    contentLocation: string;
    contentId: string | null;
    lastModifiedDateTime: string;
    isInline: boolean;
    name: string;
    size: number;
    contentBytes: string;
}

export interface GetAttachmentsResponse {
    value: Attachment[];
}

export interface GetAllEmailsResponse {
    '@odata.context': string;
    value: Email[];
}

export interface SendEmailRequest {
    message: Pick<Email, 'subject' | 'body' | 'toRecipients'> &
        Partial<Pick<Email, 'ccRecipients'>> & {
            attachments?: Pick<Attachment, '@odata.type' | 'contentBytes' | 'contentType' | 'name'>[];
        };
    saveToSentItems?: boolean;
}

export interface ReplyEmailRequest {
    message: Pick<Email, 'toRecipients'> & Partial<Pick<Email, 'ccRecipients' | 'bccRecipients'>>;
    comment: string;
}

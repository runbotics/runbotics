export interface Contact {
    id: string;
    avatar: string;
    isActive: boolean;
    lastActivity: number;
    name: string;
    username: string;
}

interface ThreadMessageAttachment {
    id: string;
    url: string;
}

export interface ThreadMessage {
    id: string;
    attachments: ThreadMessageAttachment[];
    body: string;
    contentType: string;
    createdAt: number;
    senderId: string;
}

export interface ThreadParticipant {
    id: string;
    avatar: string | null;
    name: string;
    username: string;
}

export interface Thread {
    id?: string;
    messages: ThreadMessage[];
    participants: ThreadParticipant[];
    type: 'ONE_TO_ONE' | 'GROUP';
    unreadCount: number;
}

export interface Recipient {
    id: string;
    avatar: string | null;
    name: string;
}

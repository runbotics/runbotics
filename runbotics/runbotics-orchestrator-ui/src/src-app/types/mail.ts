export interface Mail {
    id: string;
    folder: string;
    isUnread: boolean;
    isStarred: boolean;
    isImportant: boolean;
    labelIds: string[];
    subject: string;
    message: string;
    from: {
        name: string;
        email: string;
        avatar: string | null;
    };
    to: {
        name: string;
        email: string;
        avatar: string | null;
    }[];
    createdAt: number;
}

export interface Label {
    id: string;
    type: string;
    name: string;
    unreadCount?: number;
    totalCount?: number;
    color?: string;
}

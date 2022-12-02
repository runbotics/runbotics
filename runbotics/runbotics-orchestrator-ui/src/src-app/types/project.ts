export type NotificationType = 'invite' | 'message' | 'payout';

export interface Notification {
    id: string;
    value: number;
    type: NotificationType;
    message: string;
}

export interface Statistics {
    payout: number;
    projects: number;
    visitors: number;
    watching: number;
}

export interface ProjectActivity {
    id: string;
    createdAt: number;
    description: string;
    subject: string;
    type: string;
}

export interface ProjectApplicant {
    id: string;
    avatar: string;
    commonConnections: number;
    cover: string;
    labels: string[];
    name: string;
}

export interface ProjectAuthor {
    id: string;
    avatar: string;
    name: string;
}

export interface ProjectFile {
    id: string;
    mimeType: string;
    name: string;
    size: number;
    url: string;
}

export interface ProjectMember {
    id: string;
    avatar: string;
    bio: string;
    name: string;
}

export interface ProjectReview {
    id: string;
    author: {
        avatar: string;
        name: string;
    };
    comment: string;
    createdAt: number;
    value: number;
}

export interface Project {
    id: string;
    activities?: ProjectActivity[];
    applicants?: ProjectApplicant[];
    author: ProjectAuthor;
    budget: number;
    caption: string;
    currency: string;
    description?: string;
    endDate?: number;
    files?: ProjectFile[];
    image?: string;
    isActive?: boolean;
    isLiked: boolean;
    likesCount?: number;
    location: string;
    members?: ProjectMember[];
    membersCount?: number;
    rating: number;
    reviews?: ProjectReview[];
    startDate?: number;
    tags?: string[]; //
    technology?: string; //
    title: string;
    type: 'Full-Time' | 'Part-Time';
    updatedAt: number;
}

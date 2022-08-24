export type ConnectionStatus = 'connected' | 'not_connected' | 'pending' | 'rejected';

export interface Connection {
    id: string;
    avatar: string;
    commonConnections: number;
    name: string;
    status: ConnectionStatus;
}

export interface Profile {
    id: string;
    avatar: string;
    bio: string;
    connectedStatus: string;
    cover: string;
    currentCity: string;
    currentJob: {
        company: string;
        title: string;
    };
    email: string;
    name: string;
    originCity: string;
    previousJob: {
        company: string;
        title: string;
    };
    profileProgress: number;
    quote: string;
}

export interface PostComment {
    id: string;
    author: {
        id: string;
        avatar: string;
        name: string;
    };
    createdAt: number;
    message: string;
}

export interface Post {
    id: string;
    author: {
        id: string;
        avatar: string;
        name: string;
    };
    comments: PostComment[];
    createdAt: number;
    isLiked: boolean;
    likes: number;
    media?: string;
    message: string;
}

export interface ContentfulRichText {
    json: JSON;
}

export type ContentfulCollection<T> = {
    items: T[];
}

export interface BlogPost {
    status: {
        publishedAt: string | null;
        publishedVersion: number | null;
    };
    title: string;
    slug: string;
    date: string;
    readingTime: number;
    featuredImage: {
        url: string;
    };
    imageAlt?: string;
    tags: ContentfulCollection<Tag>;
    summary: string;
    body: ContentfulRichText;
    authors: ContentfulCollection<Author>;
    category: Category;
}

export interface Category {
    title: string; 
    slug: string;
}

export interface Author {
    name: string;
    slug: string;
    jobTitle?: string;
    bio: ContentfulRichText;
}

export interface Tag {
    name: string;
}

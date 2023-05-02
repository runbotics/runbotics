export interface ContentfulRichText {
    json: JSON
}

export type ContentfulCollection<T> = {
    items: T[]
}

export interface BlogPost {
    title: string;
    slug: string;
    date: string;
    featuredImage: {
        url: string;
    }
    tags: string[]
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
    bio: ContentfulRichText
}

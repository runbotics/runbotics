import { BlogPost } from './models';

export interface PaginationOptions {
    skip?: number;
    limit?: number;
}

export type QueryBuilder<T> = (options: { preview?: boolean } & T) => string;

export type FetchContentfulResponse<T> = {
    data: T;
}

export type GetAllPostsOptions = PaginationOptions;

export type GetAllPostsResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: BlogPost[];
        skip: number;
        limit: number;
        total: number;
    }
}>

export interface GetPostOptions {
    slug: string;
}

export type GetPostResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: [BlogPost];
    }
}>

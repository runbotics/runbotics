import { BlogPost, FetchContentfulResponse } from '#contentful/common';

export interface GetPostOptions {
    slug: string;
}

export type GetPostResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: [BlogPost];
    };
}>;

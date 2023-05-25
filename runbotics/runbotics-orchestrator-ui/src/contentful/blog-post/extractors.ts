import { GetPostResponse } from './types';

export function extractBlogPost(fetchResponse: GetPostResponse) {
    return fetchResponse?.data?.blogPostCollection?.items?.[0];
}

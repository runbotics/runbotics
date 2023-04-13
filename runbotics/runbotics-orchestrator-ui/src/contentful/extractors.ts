import { GetAllPostsResponse, GetPostResponse } from './types';

export function extractBlogPost(fetchResponse: GetPostResponse) {
    return fetchResponse?.data?.blogPostCollection?.items?.[0];
}

export function extractBlogPostEntries(fetchResponse: GetAllPostsResponse) {
    return fetchResponse?.data?.blogPostCollection?.items;
}

export function extractPaginationData(fetchResponse: GetAllPostsResponse) {
    return {
        skip: fetchResponse?.data?.blogPostCollection?.skip,
        limit: fetchResponse?.data?.blogPostCollection?.limit,
        total: fetchResponse?.data?.blogPostCollection?.total,
    };
}

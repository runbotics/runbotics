import { GetPostResponse } from './types';

export function extractBlogPost(fetchResponse: GetPostResponse) {
    return fetchResponse?.data?.marketplaceOfferCollection?.items?.[0];
}

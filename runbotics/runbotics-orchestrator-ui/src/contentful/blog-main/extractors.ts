import {
    GetAllCategoriesResponse,
    GetAllModelsResponse,
    GetAllPostsPathsResponse,
    GetAllPostsResponse,
} from './types';

export function extractPaginationData(fetchResponse: GetAllPostsResponse) {
    return {
        skip: fetchResponse?.data?.blogPostCollection?.skip,
        limit: fetchResponse?.data?.blogPostCollection?.limit,
        total: fetchResponse?.data?.blogPostCollection?.total,
    };
}

export function extractBlogPostEntries(fetchResponse: GetAllPostsResponse) {
    return fetchResponse?.data?.blogPostCollection?.items;
}

export function extractFeaturedBlogPostEntry(
    fetchResponse: GetAllPostsResponse
) {
    return fetchResponse?.data?.blogPostCollection?.items[0];
}

export function extractBlogPostsPaths(fetchResponse: GetAllPostsPathsResponse) {
    return fetchResponse?.data?.blogPostCollection?.items;
}

export function extractCategoryEntries(fetchResponse: GetAllCategoriesResponse) {
    return fetchResponse?.data?.blogCategoryCollection?.items;
}

export function extractAllModelsEntries(fetchResponse: GetAllModelsResponse) {
    const posts = fetchResponse?.data?.blogPostCollection?.items;
    return {
        posts,
        featuredPost: posts?.length ? posts[0] : null,
        categories: fetchResponse?.data?.blogCategoryCollection?.items,
        tags: fetchResponse?.data?.tagCollection?.items,
    };
}

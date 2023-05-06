import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import {
    extractBlogPostEntries,
    extractBlogPostsPaths,
    extractCategoryEntries,
    extractFeaturedBlogPostEntry,
    extractPaginationData,
} from './extractors';
import {
    buildAllCategoriesQuery,
    buildAllPostsPathsQuery,
    buildAllPostsQuery,
    buildFilteredPostsQuery,
} from './queries';
import {
    GetAllPostsPathsResponse,
    GetAllPostsResponse,
    GetFilteredPostsOptions,
    GetAllCategoriesResponse,
    GetAllPostsOptions,
} from './types';

export async function getAllPosts(options: GetAllPostsOptions = {}) {
    const isFirstPage = !options.skip;
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildAllPostsQuery({
            preview: IS_PREVIEW_MODE,
            ...options,
        })
    );

    return {
        posts: isFirstPage
            ? extractBlogPostEntries(entries).slice(1)
            : extractBlogPostEntries(entries),
        featuredPost: isFirstPage
            ? extractFeaturedBlogPostEntry(entries)
            : null,
        pagination: extractPaginationData(entries),
        categories: extractCategoryEntries(entries),
    };
}

export async function getAllCategories() {
    const entries = await fetchGraphQL<GetAllCategoriesResponse>(
        buildAllCategoriesQuery({
            preview: IS_PREVIEW_MODE
        })
    );

    return extractCategoryEntries(entries);
}

export async function getFilteredPosts(
    filterFragment: string,
    options: GetFilteredPostsOptions = {}
) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildFilteredPostsQuery({
            preview: IS_PREVIEW_MODE,
            filterFragment,
            ...options,
        })
    );

    return {
        posts: extractBlogPostEntries(entries),
        pagination: extractPaginationData(entries),
        categories: extractCategoryEntries(entries),
    };
}

export async function getAllPostsPaths() {
    const entries = await fetchGraphQL<GetAllPostsPathsResponse>(
        buildAllPostsPathsQuery({
            preview: IS_PREVIEW_MODE,
        })
    );

    return {
        paths: extractBlogPostsPaths(entries),
    };
}

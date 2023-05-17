import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import {
    extractAllModelsEntries as extractMainPageEntries,
    extractBlogPostEntries,
    extractBlogPostsPaths,
    extractCategoryEntries,
    extractFeaturedBlogPostEntry,
    extractPaginationData,
} from './extractors';
import {
    buildAllCategoriesQuery,
    buildMainPageQuery,
    buildAllPostsPathsQuery,
    buildAllPostsQuery,
    buildFilteredPostsQuery,
} from './queries';
import {
    GetAllPostsPathsResponse,
    GetAllPostsResponse,
    GetFilteredPostsOptions,
    GetAllCategoriesResponse,
    GetAllModelsResponse,
} from './types';

export async function getAllPosts() {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildAllPostsQuery({
            preview: IS_PREVIEW_MODE,
        })
    );

    return {
        posts: extractBlogPostEntries(entries).slice(1),
        featuredPost: extractFeaturedBlogPostEntry(entries),
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

export async function getMainPage() {
    const entries = await fetchGraphQL<GetAllModelsResponse>(
        buildMainPageQuery({
            preview: IS_PREVIEW_MODE,
        })
    );

    return extractMainPageEntries(entries);
}

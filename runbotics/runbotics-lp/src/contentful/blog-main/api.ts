

import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import { DEFAULT_LANG, Language } from '#src-app/translations/translations';

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

export async function getAllPosts(language: Language) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildAllPostsQuery({
            preview: IS_PREVIEW_MODE,
            language
        })
    );

    return {
        posts: extractBlogPostEntries(entries).slice(1),
        featuredPost: extractFeaturedBlogPostEntry(entries),
        pagination: extractPaginationData(entries),
        categories: extractCategoryEntries(entries),
    };
}

export async function getAllCategories(language: Language) {
    const entries = await fetchGraphQL<GetAllCategoriesResponse>(
        buildAllCategoriesQuery({
            preview: IS_PREVIEW_MODE,
            language
        })
    );

    return extractCategoryEntries(entries);
}

export async function getFilteredPosts(
    filterFragment: string,
    language: Language,
    options: GetFilteredPostsOptions = {},
) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildFilteredPostsQuery({
            preview: IS_PREVIEW_MODE,
            filterFragment,
            ...options,
            language
        })
    );

    return {
        posts: extractBlogPostEntries(entries),
        pagination: extractPaginationData(entries),
        categories: extractCategoryEntries(entries),
    };
}

export async function getAllPostsPaths(language: Language) {
    const entries = await fetchGraphQL<GetAllPostsPathsResponse>(
        buildAllPostsPathsQuery({
            preview: IS_PREVIEW_MODE,
            language
        })
    );

    return {
        paths: extractBlogPostsPaths(entries),
    };
}

export async function getMainPage(language: Language = DEFAULT_LANG) {
    const entries = await fetchGraphQL<GetAllModelsResponse>(
        buildMainPageQuery({
            preview: IS_PREVIEW_MODE,
            language
        })
    );

    return extractMainPageEntries(entries);
}

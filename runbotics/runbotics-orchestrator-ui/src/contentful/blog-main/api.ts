



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

import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import { Language } from '#src-app/translations/translations';

export async function getAllPosts(locale:Language) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildAllPostsQuery({
            preview: IS_PREVIEW_MODE,
            locale
        })
    );

    return {
        posts: extractBlogPostEntries(entries).slice(1),
        featuredPost: extractFeaturedBlogPostEntry(entries),
        pagination: extractPaginationData(entries),
        categories: extractCategoryEntries(entries),
    };
}

export async function getAllCategories(locale:Language) {
    const entries = await fetchGraphQL<GetAllCategoriesResponse>(
        buildAllCategoriesQuery({
            preview: IS_PREVIEW_MODE,
            locale
        })
    );

    return extractCategoryEntries(entries);
}

export async function getFilteredPosts(
    filterFragment: string,
    locale: Language,
    options: GetFilteredPostsOptions = {},
  
) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildFilteredPostsQuery({
            preview: IS_PREVIEW_MODE,
            filterFragment,
            ...options,
            locale
        })
    );

    return {
        posts: extractBlogPostEntries(entries),
        pagination: extractPaginationData(entries),
        categories: extractCategoryEntries(entries),
    };
}

export async function getAllPostsPaths(locale:Language) {
    const entries = await fetchGraphQL<GetAllPostsPathsResponse>(
        buildAllPostsPathsQuery({
            preview: IS_PREVIEW_MODE,
            locale
        })
    );

    return {
        paths: extractBlogPostsPaths(entries),
    };
}

export async function getMainPage(locale:Language) {
    const entries = await fetchGraphQL<GetAllModelsResponse>(
        buildMainPageQuery({
            preview: IS_PREVIEW_MODE,
            locale
        })
    );

    return extractMainPageEntries(entries);
}

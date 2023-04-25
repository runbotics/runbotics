import {
    extractBlogPost,
    extractBlogPostEntries,
    extractBlogPostsPaths,
    extractPaginationData,
} from './extractors';
import {
    buildAllPostsPathsQuery,
    buildAllPostsQuery,
    buildCategorisedPostsQuery,
    buildFilteredPostsQuery,
    buildPostQuery,
} from './queries';
import {
    GetAllPostsOptions,
    GetAllPostsPathsResponse,
    GetAllPostsResponse,
    GetPostOptions,
    GetPostResponse,
    QueryBuilder,
    GetCategorisedPostsOptions,
    GetFilteredPostsOptions,
} from './types';

/**
 * Use preview mode for development - posts in draft or changed state
 * Else use published posts only - without changes and drafts
 */
const IS_PREVIEW_MODE = process.env.NODE_ENV === 'development';

async function fetchGraphQL<T>(
    query: ReturnType<QueryBuilder<never>>
): Promise<T> {
    const response = await fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${
                    IS_PREVIEW_MODE
                        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
                        : process.env.CONTENTFUL_ACCESS_TOKEN
                }`,
            },
            body: JSON.stringify({ query }),
        }
    );

    return response.json();
}

export async function getAllPosts(options: GetAllPostsOptions = {}) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildAllPostsQuery({
            preview: IS_PREVIEW_MODE,
            ...options,
        })
    );

    return {
        posts: extractBlogPostEntries(entries),
        pagination: extractPaginationData(entries),
    };
}

export async function getCategorisedPosts(
    category: string,
    options: GetCategorisedPostsOptions = {}
) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(
        buildCategorisedPostsQuery({
            preview: IS_PREVIEW_MODE,
            category,
            ...options,
        })
    );

    return {
        posts: extractBlogPostEntries(entries),
        pagination: extractPaginationData(entries),
    };
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

export async function getPost(options: GetPostOptions) {
    const entry = await fetchGraphQL<GetPostResponse>(
        buildPostQuery({
            preview: IS_PREVIEW_MODE,
            ...options,
        })
    );

    return {
        post: extractBlogPost(entry),
    };
}

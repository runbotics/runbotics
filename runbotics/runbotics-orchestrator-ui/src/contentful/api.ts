import { extractBlogPost, extractBlogPostEntries, extractPaginationData } from './extractors';
import { buildAllPostsQuery, buildPostQuery } from './queries';
import { GetAllPostsOptions, GetAllPostsResponse, GetPostOptions, GetPostResponse, QueryBuilder } from './types';

const IS_PREVIEW_MODE = process.env.NODE_ENV === 'development';

async function fetchGraphQL<T>(query: ReturnType<QueryBuilder<never>>): Promise<T> {
    const response = await fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${IS_PREVIEW_MODE
                    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
                    : process.env.CONTENTFUL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ query }),
        }
    );
    
    return await response.json();
}

export async function getAllPosts(options: GetAllPostsOptions) {
    const entries = await fetchGraphQL<GetAllPostsResponse>(buildAllPostsQuery({
        preview: IS_PREVIEW_MODE,
        ...options,
    }));

    return {
        posts: extractBlogPostEntries(entries),
        pagination: extractPaginationData(entries),
    };
}

export async function getPost(options: GetPostOptions) {
    const entry = await fetchGraphQL<GetPostResponse>(buildPostQuery({
        preview: IS_PREVIEW_MODE,
        ...options,
    }));

    return {
        post: extractBlogPost(entry),
    };
}

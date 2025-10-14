import { QueryBuilder } from './types';

/**
 * Use preview mode for development - posts in draft or changed state
 * Else use published posts only - without changes and drafts
 */
export const IS_PREVIEW_MODE = process.env.NODE_ENV === 'development'
    || process.env.IS_BLOG_PREVIEW === 'true';

export async function fetchGraphQL<T>(
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

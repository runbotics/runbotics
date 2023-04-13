import { BLOG_POST_FRAGMENT, BLOG_POST_LIST_FRAGMENT } from './fragments';
import { GetAllPostsOptions, GetPostOptions, QueryBuilder } from './types';

export const buildAllPostsQuery: QueryBuilder<GetAllPostsOptions> = ({
    preview,
    skip = 0,
    limit = 10,
}) => `
query {
    blogPostCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}, skip: ${skip ?? 0}, limit: ${limit ?? 10}) {
        items {
            ${BLOG_POST_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
}
`;

export const buildPostQuery: QueryBuilder<GetPostOptions> = ({
    preview,
    slug,
}) => `
query {
    blogPostCollection(where: { slug: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
            ${BLOG_POST_FRAGMENT}
        }
    }
}
`;

import { BLOG_POST_FRAGMENT, BLOG_POST_LIST_FRAGMENT } from './fragments';
import {
    GetAllPostsOptions,
    GetPostOptions,
    QueryBuilder,
    GetCategorisedPostsOptions,
    GetFilteredPostsOptions,
} from './types';
import { DEFAULT_PAGE_SIZE } from './utils';

export const buildAllPostsQuery: QueryBuilder<GetAllPostsOptions> = ({
    preview,
    skip = 0,
    limit = DEFAULT_PAGE_SIZE,
}) => `
query {
    blogPostCollection(order: date_DESC, preview: ${
    preview ? 'true' : 'false'
}, skip: ${skip ?? 0}, limit: ${limit ?? 10}) {
        items {
            ${BLOG_POST_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
}
`;

export const buildCategorisedPostsQuery: QueryBuilder<
    GetCategorisedPostsOptions
> = ({ preview, skip = 0, limit = DEFAULT_PAGE_SIZE, category }) => `
query {
    blogPostCollection(
        order: date_DESC, 
        preview: ${preview ? 'true' : 'false'}, 
        skip: ${skip ?? 0},
        limit: ${limit ?? 10},
        where: { category: { slug: "${category}" } }
    ) {
        items {
            ${BLOG_POST_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
}
`;

export const buildFilteredPostsQuery: QueryBuilder<GetFilteredPostsOptions> = ({
    preview,
    skip = 0,
    limit = DEFAULT_PAGE_SIZE,
    filterFragment,
}) => `
query {
    blogPostCollection(
        order: date_DESC, 
        preview: ${preview ? 'true' : 'false'}, 
        skip: ${skip ?? 0},
        limit: ${limit ?? DEFAULT_PAGE_SIZE},
        where: { ${filterFragment} }
    ) { 
        items {
            ${BLOG_POST_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
}
`;

export const buildAllPostsPathsQuery: QueryBuilder = ({ preview }) => `
query {
    blogPostCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
            slug
        }
    }
}
`;

export const buildPostQuery: QueryBuilder<GetPostOptions> = ({
    preview,
    slug,
}) => `
query {
    blogPostCollection(where: { slug: "${slug}" }, preview: ${
    preview ? 'true' : 'false'
}, limit: 1) {
        items {
            ${BLOG_POST_FRAGMENT}
        }
    }
}
`;

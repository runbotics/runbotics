import { BLOG_POST_LIST_FRAGMENT, QueryBuilder } from '#contentful/common';

import {
    GetFilteredPostsOptions,
} from './types';

const blogAllCategoriesQuery = (preview: boolean) => `
blogCategoryCollection(
    preview: ${preview ? 'true' : 'false'}
) {
    items {
        title
        slug
    }
}`;

const blogAllTagsQuery = (preview: boolean) => `
tagCollection(preview:  ${preview ? 'true' : 'false'}) {
    items {
        name
        slug
    }
}`;

const blogAllPostsQuery = (preview: boolean) => `
blogPostCollection(
    order: date_DESC,
    preview: ${preview ? 'true' : 'false'},
) {
    items {
        ${BLOG_POST_LIST_FRAGMENT}
    }
    total
}`;

export const buildMainPageQuery: QueryBuilder = ({ preview }) => `
query {
    ${blogAllPostsQuery(preview)}
    ${blogAllCategoriesQuery(preview)}
    ${blogAllTagsQuery(preview)}
}`;

export const buildAllPostsQuery: QueryBuilder = ({
    preview,
}) => `
query {
    blogPostCollection(
        order: date_DESC,
        preview: ${preview ? 'true' : 'false'}
    ) {
        items {
            ${BLOG_POST_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
    ${blogAllCategoriesQuery(preview)}
}`;

export const buildAllCategoriesQuery: QueryBuilder = ({ preview }) => `
query {
    ${blogAllCategoriesQuery(preview)}
}`;

export const buildFilteredPostsQuery: QueryBuilder<GetFilteredPostsOptions> = ({
    preview,
    filterFragment,
}) => `
query {
    blogPostCollection(
        order: date_DESC, 
        preview: ${preview ? 'true' : 'false'}, 
        where: { ${filterFragment} }
    ) { 
        items {
            ${BLOG_POST_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
    ${blogAllCategoriesQuery(preview)}
}`;

export const buildAllPostsPathsQuery: QueryBuilder = ({ preview }) => `
query {
    blogPostCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
            slug
        }
    }
}`;

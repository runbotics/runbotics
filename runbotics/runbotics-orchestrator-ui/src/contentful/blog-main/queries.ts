
import {
    GetFilteredPostsOptions,
} from './types';

import { BLOG_POST_LIST_FRAGMENT, QueryBuilder, QUERRY_LANGAUGE } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

const blogAllCategoriesQuery = (preview: boolean, locale: Language) => `
blogCategoryCollection(
    preview: ${preview ? 'true' : 'false'}, locale: "${QUERRY_LANGAUGE[locale]}"
) {
    items {
        title
        slug
    }
}`;

const blogAllTagsQuery = (preview: boolean, locale: Language) => `
tagCollection(preview:  ${preview ? 'true' : 'false'},   locale: "${QUERRY_LANGAUGE[locale]}") {
    items {
        name
        slug
    }
}`;

const blogAllPostsQuery = (preview: boolean, locale: Language) => `
blogPostCollection(
    order: date_DESC,
    preview: ${preview ? 'true' : 'false'},
    locale: "${QUERRY_LANGAUGE[locale]}"
) {
    items {
        ${BLOG_POST_LIST_FRAGMENT}
    }
    total
}`;

export const buildMainPageQuery: QueryBuilder = ({ preview, locale }) => `
query {
    ${blogAllPostsQuery(preview, locale)}
    ${blogAllCategoriesQuery(preview, locale)}
    ${blogAllTagsQuery(preview, locale)}
}`;

export const buildAllPostsQuery: QueryBuilder = ({
    preview,
    locale
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
    ${blogAllCategoriesQuery(preview, locale)}
}`;

export const buildAllCategoriesQuery: QueryBuilder = ({ preview, locale }) => `
query {
    ${blogAllCategoriesQuery(preview, locale)}
}`;

export const buildFilteredPostsQuery: QueryBuilder<GetFilteredPostsOptions> = ({
    preview,
    filterFragment,
    locale
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
    ${blogAllCategoriesQuery(preview, locale)}
}`;

export const buildAllPostsPathsQuery: QueryBuilder = ({ preview }) => `
query {
    blogPostCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
            slug
        }
    }
}`;

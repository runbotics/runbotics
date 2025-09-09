

import { BLOG_POST_LIST_FRAGMENT, QueryBuilder, QUERY_LANGAUGE } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

import {
    GetFilteredPostsOptions,
} from './types';

const blogAllCategoriesQuery = (preview: boolean, locale: Language) => `
blogCategoryCollection(
    preview: ${preview ? 'true' : 'false'}, locale: "${QUERY_LANGAUGE[locale]}"
) {
    items {
        title
        slug
    }
}`;

const blogAllTagsQuery = (preview: boolean, language: Language) => `
tagCollection(preview:  ${preview ? 'true' : 'false'},   locale: "${QUERY_LANGAUGE[language]}") {
    items {
        name
        slug
    }
}`;

const blogAllPostsQuery = (preview: boolean, language: Language) => `
blogPostCollection(
    order: date_DESC,
    preview: ${preview ? 'true' : 'false'},
    locale: "${QUERY_LANGAUGE[language]}"
) {
    items {
        ${BLOG_POST_LIST_FRAGMENT}
    }
    total
}`;

export const buildMainPageQuery: QueryBuilder = ({ preview, language }) => `
query {
    ${blogAllPostsQuery(preview, language)}
    ${blogAllCategoriesQuery(preview, language)}
    ${blogAllTagsQuery(preview, language)}
}`;

export const buildAllPostsQuery: QueryBuilder = ({
    preview,
    language
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
    ${blogAllCategoriesQuery(preview, language)}
}`;

export const buildAllCategoriesQuery: QueryBuilder = ({ preview, language }) => `
query {
    ${blogAllCategoriesQuery(preview, language)}
}`;

export const buildFilteredPostsQuery: QueryBuilder<GetFilteredPostsOptions> = ({
    preview,
    filterFragment,
    language
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
    ${blogAllCategoriesQuery(preview, language)}
}`;

export const buildAllPostsPathsQuery: QueryBuilder = ({ preview }) => `
query {
    blogPostCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
            slug
        }
    }
}`;

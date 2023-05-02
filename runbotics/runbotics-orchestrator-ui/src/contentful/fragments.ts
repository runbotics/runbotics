// Full fragments of graphql types

import { FilterQueryParams } from './types';

export const AUTHOR_FRAGMENT = `
    name: entryTitle
    slug
    jobTitle
    bio {
        json
    }
`;

export const BLOG_CATEGORY_FRAGMENT = `
    title
    slug
`;

export const BLOG_POST_FRAGMENT = `
    title
    slug
    date
    featuredImage {
        url
    }
    tags
    summary
    body {
        json
    }
    authors: authorsCollection {
        items {
            ${AUTHOR_FRAGMENT}
        }
    }
    category{
        ${BLOG_CATEGORY_FRAGMENT}
    }
`;

export const BLOG_POST_LIST_FRAGMENT = `
    title
    slug
    date
    featuredImage {
        url
    }
    tags
    summary
    category{
        ${BLOG_CATEGORY_FRAGMENT}
    }
`;

export const buildFilterFragment = (options: FilterQueryParams) => {
    const { category, selectedTags, startDate, endDate } = options;
    const query = [];

    if (category) query.push(`category: { slug: "${category}" }`);
    if (selectedTags?.length) {
        query.push(
            `tags_contains_all: [${selectedTags.map((tag) => `"${tag}"`)}]`
        );
    }
    if (startDate) query.push(`date_gte: "${startDate}"`);
    if (endDate) query.push(`date_lte: "${endDate}"`);

    return query.join(', ');
};

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

export const BLOG_TAGS_FRAGMENT = `
    tagsCollection {
        items {
            name
        }
    }
`;

export const BLOG_POST_FRAGMENT = `
    title
    slug
    date
    featuredImage {
        url
    }
    ${BLOG_TAGS_FRAGMENT}
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
    tags: ${BLOG_TAGS_FRAGMENT}
    summary
    category {
        ${BLOG_CATEGORY_FRAGMENT}
    }
`;

export const buildFilterFragment = (options: FilterQueryParams) => {
    const { categories, search, startDate, endDate } = options;
    const query = [];

    if (categories?.length) {
        query.push(
            `category: { slug_in: ${JSON.stringify(categories)} }`
        );
    }
    // if (tags?.length) {
    //     query.push(
    //         `tags: { name_in: ${JSON.stringify(tags)} }`
    //     );
    // }
    if (search) {
        query.push(`
            OR: [
                { title_contains: "${search}" },
                { summary_contains: "${search}" }
            ]
        `);
    }
    if (startDate) query.push(`date_gte: "${startDate}"`);
    if (endDate) query.push(`date_lte: "${endDate}"`);

    return query.join(', ');
};

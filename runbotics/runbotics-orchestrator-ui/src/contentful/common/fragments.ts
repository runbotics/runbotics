// Full fragments of graphql types

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

export const BLOG_POST_LIST_FRAGMENT = `
    status: sys {
        publishedAt
        publishedVersion
    }
    title
    slug
    date
    readingTime
    featuredImage {
        url
    }
    imageAlt
    tags: ${BLOG_TAGS_FRAGMENT}
    summary
    category {
        ${BLOG_CATEGORY_FRAGMENT}
    }
`;

export const BLOG_POST_FRAGMENT = `
    ${BLOG_POST_LIST_FRAGMENT}
    body {
        json
    }
    authors: authorsCollection {
        items {
            ${AUTHOR_FRAGMENT}
        }
    }
`;

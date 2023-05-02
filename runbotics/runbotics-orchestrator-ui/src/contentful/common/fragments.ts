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

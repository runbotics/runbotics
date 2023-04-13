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
    categories: categoriesCollection {
        items {
            ${BLOG_CATEGORY_FRAGMENT}
        }
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
    categories: categoriesCollection {
        items {
            ${BLOG_CATEGORY_FRAGMENT}
        }
    }
`;

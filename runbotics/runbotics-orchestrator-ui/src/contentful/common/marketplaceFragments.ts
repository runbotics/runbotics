// Full fragments of graphql types


export const MARKETPLACE_INDUSTRY_FRAGMENT = `
    industriesCollection(limit: 20) {
        items {
            title
            slug
        }
    }
`;

export const MARKETPLACE_TAGS_FRAGMENT = `
    tagsCollection {
        items {
            name
            slug
        }
    }
`;

export const MARKETPLACE_OFFER_LIST_FRAGMENT = `
    status: sys {
        publishedAt
        publishedVersion
    }
    title
    slug
    tags: ${MARKETPLACE_TAGS_FRAGMENT}
    description
`;

export const MARKETPLACE_OFFER_FRAGMENT = `
    ${MARKETPLACE_OFFER_LIST_FRAGMENT}
    body {
        json
        links {
            assets {
                blocks: block {
                    sys {
                        id
                    }
                    url
                    title
                    width
                    height
                }
            }
        }
    }
`;

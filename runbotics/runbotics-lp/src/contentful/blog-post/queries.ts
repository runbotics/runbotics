import { BLOG_POST_FRAGMENT, MARKETPLACE_OFFER_FRAGMENT, QUERY_LANGAUGE, QueryBuilder } from '#contentful/common';


import { GetPostOptions } from './types';

export const buildPostQuery: QueryBuilder<GetPostOptions> = ({
    preview,
    slug,
    language
}) => `
query {
    blogPostCollection(where: { slug: "${slug}" }, preview: ${
    preview ? 'true' : 'false'
}, locale: "${QUERY_LANGAUGE[language]}" ,limit: 1) {
        items {
            ${BLOG_POST_FRAGMENT}
        }
    }
}
`;

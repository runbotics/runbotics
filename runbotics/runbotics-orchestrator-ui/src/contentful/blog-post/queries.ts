import { GetPostOptions } from './types';

import { BLOG_POST_FRAGMENT, QUERRY_LANGAUGE, QueryBuilder } from '#contentful/common';

export const buildPostQuery: QueryBuilder<GetPostOptions> = ({
    preview,
    slug,
    locale
}) => `
query {
    blogPostCollection(where: { slug: "${slug}" }, preview: ${
    preview ? 'true' : 'false'
}, locale: "${QUERRY_LANGAUGE[locale]}" ,limit: 1) {
        items {
            ${BLOG_POST_FRAGMENT}
        }
    }
}
`;

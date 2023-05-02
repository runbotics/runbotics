import { BLOG_POST_FRAGMENT, QueryBuilder } from '#contentful/common';

import { GetPostOptions } from './types';

export const buildPostQuery: QueryBuilder<GetPostOptions> = ({
    preview,
    slug,
}) => `
query {
    blogPostCollection(where: { slug: "${slug}" }, preview: ${
    preview ? 'true' : 'false'
}, limit: 1) {
        items {
            ${BLOG_POST_FRAGMENT}
        }
    }
}
`;

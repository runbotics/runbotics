import { MARKETPLACE_OFFER_FRAGMENT, QUERY_LANGAUGE, QueryBuilder } from '#contentful/common';


import { GetOfferOptions } from './types';

export const buildOfferQuery: QueryBuilder<GetOfferOptions> = ({
    preview,
    slug,
    language
}) => `
query {
    marketplaceOfferCollection(where: { slug: "${slug}" }, preview: ${
    preview ? 'true' : 'false'
}, locale: "${QUERY_LANGAUGE[language]}" ,limit: 1) {
        items {
            ${MARKETPLACE_OFFER_FRAGMENT}
        }
    }
}
`;



import { MARKETPLACE_OFFER_LIST_FRAGMENT, QueryBuilder, QUERY_LANGAUGE } from '#contentful/common';
import { Language } from '#src-app/translations/translations';

import {
    GetFilteredOffersOptions,
} from './types';

const marketplaceAllIndustriesQuery = (preview: boolean, locale: Language) => `
industryCollection(
    preview: ${preview ? 'true' : 'false'}, locale: "${QUERY_LANGAUGE[locale]}"
) {
    items {
        title
        slug
    }
}`;

const marketplaceAllTagsQuery = (preview: boolean, language: Language) => `
marketplaceTagCollection(preview:  ${preview ? 'true' : 'false'},   locale: "${QUERY_LANGAUGE[language]}") {
    items {
        name
        slug
    }
}`;

const marketplaceAllOffersQuery = (preview: boolean, language: Language) => `
marketplaceOfferCollection(
    preview: ${preview ? 'true' : 'false'},
    locale: "${QUERY_LANGAUGE[language]}"
) {
    items {
        ${MARKETPLACE_OFFER_LIST_FRAGMENT}
    }
    total
}`;

export const buildMainPageQuery: QueryBuilder = ({ preview, language }) => `
query {
    ${marketplaceAllOffersQuery(preview, language)}
    ${marketplaceAllIndustriesQuery(preview,language)}
    ${marketplaceAllTagsQuery(preview, language)}
}`;

export const buildAllOffersQuery: QueryBuilder = ({
    preview,
    language
}) => `
query {
    marketplaceOfferCollection(
        preview: ${preview ? 'true' : 'false'}
    ) {
        items {
            ${MARKETPLACE_OFFER_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
    ${marketplaceAllIndustriesQuery(preview, language)}
}`;

export const buildAllCategoriesQuery: QueryBuilder = ({ preview, language }) => `
query {
    ${marketplaceAllIndustriesQuery(preview, language)}
}`;

export const buildFilteredOffersQuery: QueryBuilder<GetFilteredOffersOptions> = ({
    preview,
    filterFragment,
    language
}) => `
query {
    marketplaceOfferCollection(
        preview: ${preview ? 'true' : 'false'},
        where: { ${filterFragment} }
    ) {
        items {
            ${MARKETPLACE_OFFER_LIST_FRAGMENT}
        }
        skip
        limit
        total
    }
    ${marketplaceAllIndustriesQuery(preview, language)}
}`;

export const buildAllOffersPathsQuery: QueryBuilder = ({ preview }) => `
query {
    marketplaceOfferCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
            slug
        }
    }
}`;

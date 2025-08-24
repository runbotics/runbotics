import { fetchGraphQL, IS_PREVIEW_MODE } from '#contentful/common';

import { DEFAULT_LANG, Language } from '#src-app/translations/translations';

import {
    extractAllModelsEntries as extractMainPageEntries,
    extractFeaturedMarketplaceOfferEntry,
    extractIndustryEntries,
    extractMarketplaceOfferEntries,
    extractMarketplaceOffersPaths,
    extractPaginationData,
} from './extractors';
import {
    buildAllCategoriesQuery,
    buildAllOffersPathsQuery,
    buildAllOffersQuery,
    buildFilteredOffersQuery,
    buildMainPageQuery,
} from './queries';
import {
    GetAllIndustriesResponse,
    GetAllModelsResponse,
    GetAllOffersPathsResponse,
    GetAllOffersResponse,
    GetFilteredOffersOptions,
} from './types';


export async function getAllOffers(language: Language) {
    const entries = await fetchGraphQL<GetAllOffersResponse>(
        buildAllOffersQuery({
            preview: IS_PREVIEW_MODE,
            language,
        }),
    );

    return {
        offers: extractMarketplaceOfferEntries(entries),
        featuredOffer: extractFeaturedMarketplaceOfferEntry(entries),
        pagination: extractPaginationData(entries),
        industries: extractIndustryEntries(entries),
    };
}

export async function getAllCategories(language: Language) {
    const entries = await fetchGraphQL<GetAllIndustriesResponse>(
        buildAllCategoriesQuery({
            preview: IS_PREVIEW_MODE,
            language,
        }),
    );

    return extractIndustryEntries(entries);
}

export async function getFilteredOffers(
    filterFragment: string,
    language: Language,
    options: GetFilteredOffersOptions = {},
) {
    const entries = await fetchGraphQL<GetAllOffersResponse>(
        buildFilteredOffersQuery({
            preview: IS_PREVIEW_MODE,
            filterFragment,
            ...options,
            language,
        }),
    );

    return {
        offers: extractMarketplaceOfferEntries(entries),
        pagination: extractPaginationData(entries),
        industries: extractIndustryEntries(entries),
    };
}

export async function getAllOffersPaths(language: Language) {
    const entries = await fetchGraphQL<GetAllOffersPathsResponse>(
        buildAllOffersPathsQuery({
            preview: IS_PREVIEW_MODE,
            language,
        }),
    );

    return {
        paths: extractMarketplaceOffersPaths(entries),
    };
}

export async function getMainPage(language: Language = DEFAULT_LANG) {
    const entries = await fetchGraphQL<GetAllModelsResponse>(
        buildMainPageQuery({
            preview: IS_PREVIEW_MODE,
            language,
        }),
    );
    return extractMainPageEntries(entries);
}

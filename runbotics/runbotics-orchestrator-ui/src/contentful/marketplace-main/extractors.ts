import {
    GetAllIndustriesResponse,
    GetAllModelsResponse,
    GetAllOffersPathsResponse,
    GetAllOffersResponse,
} from './types';

export function extractPaginationData(fetchResponse: GetAllOffersResponse) {
    return {
        skip: fetchResponse?.data?.marketplaceOfferCollection?.skip,
        limit: fetchResponse?.data?.marketplaceOfferCollection?.limit,
        total: fetchResponse?.data?.marketplaceOfferCollection?.total,
    };
}

export function extractMarketplaceOfferEntries(fetchResponse: GetAllOffersResponse) {
    return fetchResponse?.data?.marketplaceOfferCollection?.items;
}

export function extractFeaturedMarketplaceOfferEntry(
    fetchResponse: GetAllOffersResponse
) {
    return fetchResponse?.data?.marketplaceOfferCollection?.items[0];
}

export function extractMarketplaceOffersPaths(fetchResponse: GetAllOffersPathsResponse) {
    return fetchResponse?.data?.marketplaceOfferCollection?.items;
}

export function extractIndustryEntries(fetchResponse: GetAllIndustriesResponse) {
    return fetchResponse?.data?.industryCollection?.items;
}

export function extractAllModelsEntries(fetchResponse: GetAllModelsResponse) {
    const offers = fetchResponse?.data?.marketplaceOfferCollection?.items;
    return {
        offers,
        featuredOffer: null,
        industries: fetchResponse?.data?.industryCollection?.items,
        tags: fetchResponse?.data?.marketplaceTagCollection?.items,
    };
}

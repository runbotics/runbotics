import { GetOfferResponse } from './types';

export function extractMarketplaceOffer(fetchResponse: GetOfferResponse) {
    return fetchResponse?.data?.marketplaceOfferCollection?.items?.[0];
}

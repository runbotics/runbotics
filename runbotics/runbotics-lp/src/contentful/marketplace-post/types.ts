import { FetchContentfulResponse, MarketplaceOffer } from '#contentful/common';

export interface GetOfferOptions {
    slug: string;
}

export type GetOfferResponse = FetchContentfulResponse<{
    marketplaceOfferCollection: {
        items: [MarketplaceOffer];
    };
}>;

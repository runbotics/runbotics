import { getMainPage } from '#contentful/blog-main';
import { FetchContentfulResponse, Industry, MarketplaceOffer, Tag } from '#contentful/common';

interface AllOffersCollection {
    marketplaceOfferCollection: {
        items: MarketplaceOffer[];
        skip: number;
        limit: number;
        total: number;
    };
}

export type GetAllOffersResponse = FetchContentfulResponse<
    & AllOffersCollection
    & AllTagsCollection
>

export interface GetFilteredOffersOptions {
    filterFragment?: string;
};

export type GetAllOffersPathsResponse = FetchContentfulResponse<{
    marketplaceOfferCollection: {
        items: Pick<MarketplaceOffer, 'slug'>[];
    };
}>;

export type GetAllIndustriesResponse = FetchContentfulResponse<AllIndustriesCollection>;

interface AllIndustriesCollection {
    industryCollection: {
        items: Industry[];
    };
}

interface AllTagsCollection {
    tagCollection: {
        items: Tag[];
    };
}

export type GetAllModelsResponse = FetchContentfulResponse<
    & AllOffersCollection
    & AllIndustriesCollection
    & AllTagsCollection
>

//TODO: change getMainPage to type of getMainMarketplacePage when cache is done
export type MarketplaceMainCache = Awaited<ReturnType<typeof getMainPage>> | null;

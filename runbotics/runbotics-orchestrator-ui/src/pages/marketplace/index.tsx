import { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { DEFAULT_PAGE_SIZE, Industry, MarketplaceOffer, Page, Tag } from '#contentful/common';

import { getMarketplaceMainCache, isMarketplaceCached, recreateMarketplaceCache } from '#contentful/marketplace-main';
import MarketplaceBg from '#public/images/banners/marketplace-banner.png';

import { Language } from '#src-app/translations/translations';
import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import MarketplaceView from '#src-landing/views/MarketplaceView';

interface Props {
    offers: MarketplaceOffer[];
    industries: Industry[];
    tags: Tag[];
    page: Page;
}

const MarketplacePage: VFC<Props> = ({ offers, industries, tags, page }) => (
    <MarketplaceView
        offers={offers}
        industries={industries}
        tags={tags}
        page={page}
    />
);

export default MarketplacePage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, locale, res }) => {
    const language = locale as Language;
    
    if (!isMarketplaceCached(language)) {
        await recreateMarketplaceCache();
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const cache = getMarketplaceMainCache(language);
    console.log(cache);
    const metadata: MetadataTags = {
        title: 'RunBotics | Marketplace',
        description: 'RunBotics - Marketplace',
        image: MarketplaceBg.src,
    };
    //
    // if (hasQueryParams(query, FILTER_QUERY_PARAMS)) {
    //     const queryParams = extractFilterQueryParams(query);
    //
    //     const isMoreThanPage = Object.keys(queryParams).length > 1
    //         || !Object.keys(queryParams).includes(FilterQueryParamsEnum.Page);
    //     const filteredPosts = filterPosts(cache.posts, queryParams);
    //     const currentPage = queryParams.page && queryParams.page > 1 ? queryParams.page : 1;
    //     const totalPages = Math.ceil(filteredPosts.length / DEFAULT_PAGE_SIZE);
    //
    //     const firstPageElementIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    //     const regularPosts = isMoreThanPage ? filteredPosts : (filteredPosts?.slice(1) ?? []);
    //     const currentPagePosts = regularPosts?.slice(firstPageElementIndex, currentPage * DEFAULT_PAGE_SIZE) ?? [];
    //
    //     return {
    //         props: {
    //             ...cache,
    //             metadata,
    //             posts: currentPagePosts,
    //             featuredPost: !isMoreThanPage && currentPage === 1 ? cache.featuredPost : null,
    //             page: {
    //                 current: currentPage,
    //                 total: totalPages,
    //             }
    //         },
    //     };
    // }
    //
    const offers = cache?.offers;
    const totalPages = Math.ceil((offers?.length ?? 0) / DEFAULT_PAGE_SIZE);

    return {
        props: {
            ...cache,
            metadata,
            offers,
            page: {
                current: 1,
                total: totalPages,
            }
        },
    };
};

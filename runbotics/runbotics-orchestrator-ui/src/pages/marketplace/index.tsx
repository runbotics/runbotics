import { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { Industry, MarketplaceOffer, Page, Tag } from '#contentful/common';

import MarketplaceBg from '#public/images/banners/marketplace-banner.png';

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
    // const language = locale as Language;

    // if (!isCached(language)) {
    //     await recreateCache();
    // } else {
    //     res.setHeader('X-Cache', 'HIT');
    // }

    // const cache = getBlogMainCache(language);

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
    // const posts = cache?.posts;
    // const regularPosts = posts?.slice(1) ?? [];
    // const totalPages = Math.ceil(regularPosts.length / DEFAULT_PAGE_SIZE);

    return {
        props: {
            metadata,
            offers: [],
            industries: [],
            tags: [],
            page: {
                current: 1,
                total: 1,
            },
        },
    };
};

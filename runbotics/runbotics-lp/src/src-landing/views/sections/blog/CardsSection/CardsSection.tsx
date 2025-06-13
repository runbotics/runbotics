import React, { FC, ReactElement } from 'react';

import { BlogPost, MarketplaceOffer, Page } from '#contentful/common';
import If from '#src-app/components/utils/If';
import CardsGrid from '#src-landing/components/BlogCardsGrid';
import { PageType } from '#src-landing/components/BlogCardsGrid/CardsGrid';
import CardsPagination from '#src-landing/components/PostPagination';

import styles from './CardsSection.module.scss';
import { ClientOnly } from '#src-landing/noSSR';

interface CardsSectionPropsBase {
    pageType: PageType;
    cards: unknown[];
    page: Page;
    searchBar?: ReactElement;
    notFoundInfo?: ReactElement;
    isNotFoundVisible?: boolean;
}

interface CardsBlogSectionProps extends CardsSectionPropsBase {
    pageType: PageType.BLOG;
    cards: BlogPost[];
    featuredCard?: BlogPost;
    page: Page;
}

interface CardsMarketplaceSectionProps extends CardsSectionPropsBase {
    pageType: PageType.MARKETPLACE;
    cards: MarketplaceOffer[];
    featuredCard?: MarketplaceOffer;
    page: Page;
}

export type CardsSectionPropsType = CardsBlogSectionProps | CardsMarketplaceSectionProps;

const CardsSection: FC<CardsSectionPropsType> = ({
    pageType,
    cards,
    featuredCard,
    page,
    searchBar,
    notFoundInfo,
    isNotFoundVisible,
}) => {
    const cardsGrid = <>
        {/*@ts-expect-error union of types are not well served in typescript so the pageType is incompatible even if values are the same*/}
        <CardsGrid
            pageType={pageType}
            cards={cards}
            featuredCard={featuredCard}
        />
        <If condition={page.total > 1}>
            <CardsPagination page={page} basePageUrl={pageType} />
        </If>
    </>;
    
    return (
        <div className={pageType === 'marketplace' ? styles.root : styles.justifiedRoot}>
            {searchBar}
            <ClientOnly>
            {notFoundInfo ?
                <If condition={isNotFoundVisible} else={notFoundInfo}>
                    {cardsGrid}
                </If> :
                cardsGrid
            }
            </ClientOnly>
        </div>
    );
};

export default CardsSection;

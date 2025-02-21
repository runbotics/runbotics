import React, { FC, ReactElement } from 'react';

import { BlogPost, MarketplaceOffer, Page } from '#contentful/common';
import If from '#src-app/components/utils/If';
import CardsGrid from '#src-landing/components/BlogCardsGrid';
import { PageType } from '#src-landing/components/BlogCardsGrid/CardsGrid';
import CardsPagination from '#src-landing/components/PostPagination';

import styles from './CardsSection.module.scss';

interface CardsSectionPropsBase {
    pageType: PageType;
    cards: unknown[];
    page: Page;
    searchBar?: ReactElement;
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
    searchBar
}) => (
    <div className={styles.root}>
        {searchBar}
        {/*@ts-expect-error union of types are not well served in typescript so the pageType is incompatible even if values are the same*/}
        <CardsGrid
            pageType={pageType}
            cards={cards}
            featuredCard={featuredCard}
        />
        <If condition={page.total > 1}>
            <CardsPagination page={page}/>
        </If>
    </div>
);

export default CardsSection;

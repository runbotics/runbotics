import React, { FC } from 'react';

import { BlogPost, MarketplaceOffer, Page } from '#contentful/common';
import If from '#src-app/components/utils/If';
import CardsGrid from '#src-landing/components/BlogCardsGrid';
import CardsPagination from '#src-landing/components/PostPagination';

import styles from './CardsSection.module.scss';

interface CardsSectionPropsBase {
    pageType: string;
    cards: unknown[];
    page: Page;
}

interface CardsBlogSectionProps extends CardsSectionPropsBase {
    pageType: 'blog';
    cards: BlogPost[];
    featuredCard?: BlogPost;
    page: Page;
}

interface CardsMarketplaceSectionProps extends CardsSectionPropsBase {
    pageType: 'marketplace';
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
}) => (
    <div className={styles.root}>
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

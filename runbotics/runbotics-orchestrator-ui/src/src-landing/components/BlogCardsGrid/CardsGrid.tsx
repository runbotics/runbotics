import React, { FC } from 'react';

import { BlogPost, MarketplaceOffer } from '#contentful/common';
import If from '#src-app/components/utils/If';

import MarketplaceCard from '#src-landing/components/MarketplaceCard';

import styles from './CardsGrid.module.scss';
import BlogCard from '../BlogCard/BlogCard';
import FeaturedBlogCard from '../FeaturedBlogCard';

interface CardsGridPropsBase {
    pageType: string;
    cards: unknown[];
}

export enum PageType {
    BLOG = 'blog',
    MARKETPLACE = 'marketplace',
}

interface CardsGridPropsBase {
    pageType: PageType;
    cards: unknown[];
}

interface CardsBlogGridProps extends CardsGridPropsBase {
    pageType: PageType.BLOG;
    cards: BlogPost[];
    featuredCard?: BlogPost;
}

interface CardsMarketplaceGridProps extends CardsGridPropsBase {
    pageType: PageType.MARKETPLACE;
    cards: MarketplaceOffer[];
    featuredCard?: MarketplaceOffer;
}

export type CardsGridPropsType = CardsBlogGridProps | CardsMarketplaceGridProps;

const CardsGrid: FC<CardsGridPropsType> = ({
    pageType,
    cards,
    featuredCard,
}) => {
    if( pageType === PageType.MARKETPLACE ) {
        return (
            <div className={styles.root}>
                {cards.map(card => (
                    <MarketplaceCard offer={card} key={card.slug} />
                ))}
            </div>
        );
    } 
    return (
        <div className={styles.root}>
            <If condition={Boolean(featuredCard)}>
                <FeaturedBlogCard post={featuredCard}/>
            </If>
            {cards.map((card) => (
                <BlogCard key={card.slug} post={card}/>
            ))}
        </div>
    );
    
};

export default CardsGrid;

import { VFC } from 'react';

import { BlogPost, MarketplaceOffer } from '#contentful/common';
import BlogCard from '#src-landing/components/BlogCard';
import MediaScroller from '#src-landing/components/MediaScroller';

import styles from './MarketplaceOfferCarousel.module.scss';

interface Props {
    offers: MarketplaceOffer[];
}

const MarketplaceOfferCarousel: VFC<Props> = ({ offers }) => {
    const slides = offers.map((post) => (
        // <BlogCard
        //     key={post.slug}
        //     className={styles.blogCard}
        //     post={post}
        // />
        <div>
            
        </div>
    ));

    return (
        <MediaScroller className={styles.mediaScroller}>
            {slides}
        </MediaScroller>
    );
};

export default MarketplaceOfferCarousel;

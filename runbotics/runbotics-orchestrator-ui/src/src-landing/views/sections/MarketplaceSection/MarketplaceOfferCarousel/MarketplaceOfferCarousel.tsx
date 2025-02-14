import { VFC } from 'react';

import { MarketplaceOffer } from '#contentful/common';
import MediaScroller from '#src-landing/components/MediaScroller';

import styles from './MarketplaceOfferCarousel.module.scss';

interface Props {
    offers: MarketplaceOffer[];
}

const MarketplaceOfferCarousel: VFC<Props> = ({ offers }) => {
    
    const slides = offers.map((_post) => (<div key={'key-temp'}></div>));
    // code left for future feature
    // <BlogCard
    //     key={post.slug}
    //     className={styles.blogCard}
    //     post={post}
    // />
    return (
        <MediaScroller className={styles.mediaScroller}>
            {slides}
        </MediaScroller>
    );
};

export default MarketplaceOfferCarousel;

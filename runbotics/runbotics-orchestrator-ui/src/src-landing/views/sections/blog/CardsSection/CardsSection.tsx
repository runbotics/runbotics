import React, { FC } from 'react';

import { BlogPost, Page } from '#contentful/common';
import If from '#src-app/components/utils/If';
import CardsGrid from '#src-landing/components/BlogCardsGrid';
import CardsPagination from '#src-landing/components/PostPagination';

import styles from './CardsSection.module.scss';

interface CardsSectionProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
    page: Page;
}


const CardsSection: FC<CardsSectionProps> = ({
    posts,
    featuredPost,
    page,
}) => (
    <div className={styles.root}>
        <CardsGrid
            posts={posts}
            featuredPost={featuredPost}
        />
        <If condition={page.total > 1}>
            <CardsPagination page={page} />
        </If>
    </div>
);

export default CardsSection;

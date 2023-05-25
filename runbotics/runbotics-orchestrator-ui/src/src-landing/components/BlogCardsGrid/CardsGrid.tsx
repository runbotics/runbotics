import React, { FC } from 'react';

import { BlogPost } from '#contentful/common';
import If from '#src-app/components/utils/If';

import BlogCard from '../BlogCard/BlogCard';
import FeaturedBlogCard from '../FeaturedBlogCard';
import styles from './CardsGrid.module.scss';


interface CardsGridProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
}

const CardsGrid: FC<CardsGridProps> = ({
    posts,
    featuredPost,
}) => (
    <div className={styles.root}>
        <If condition={Boolean(featuredPost)}>
            <FeaturedBlogCard post={featuredPost} />
        </If>
        {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
        ))}
    </div>
);

export default CardsGrid;

import React, { FC } from 'react';

import BlogCard from '#src-landing/components/BlogCard/BlogCard';
import { BlogPost } from 'src/contentful/models';

import styles from './CardsSection.module.scss';

interface Props {
    posts: BlogPost[];
}

const BlogCardsSection: FC<Props> = ({ posts }) => (
    <div className={styles.root}>
        <div className={styles.topFilters}>top filters</div>
        <div className={styles.featuredCard}>blog cards</div>
        {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
        ))}
    </div>
);

export default BlogCardsSection;

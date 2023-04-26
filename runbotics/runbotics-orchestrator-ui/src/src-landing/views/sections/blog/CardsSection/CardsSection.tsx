import React, { FC } from 'react';

import BlogCard from '#src-landing/components/BlogCard/BlogCard';
import FeaturedBlogCard from '#src-landing/components/FeaturedBlogCard';
import { BlogPost } from 'src/contentful/models';

import styles from './CardsSection.module.scss';

interface BlogCardsSectionProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
}

const BlogCardsSection: FC<BlogCardsSectionProps> = ({
    posts,
    featuredPost,
}) => (
    <div className={styles.root}>
        <div className={styles.topFilters}>top filters</div>
        {featuredPost ? <FeaturedBlogCard post={featuredPost} /> : null}
        {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
        ))}
    </div>
);

export default BlogCardsSection;

import React, { FC } from 'react';

import { BlogPost } from '#contentful/models';
import BlogCard from '#src-landing/components/BlogCard/BlogCard';
import FeaturedBlogCard from '#src-landing/components/FeaturedBlogCard';

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
        {featuredPost ? <FeaturedBlogCard post={featuredPost} /> : null}
        {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
        ))}
    </div>
);

export default BlogCardsSection;

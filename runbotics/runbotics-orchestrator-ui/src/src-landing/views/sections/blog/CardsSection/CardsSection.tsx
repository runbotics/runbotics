import React, { forwardRef } from 'react';

import { BlogPost } from '#contentful/common';
import BlogCard from '#src-landing/components/BlogCard/BlogCard';
import FeaturedBlogCard from '#src-landing/components/FeaturedBlogCard';

import styles from './CardsSection.module.scss';


interface BlogCardsSectionProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
}

const BlogCardsSection = forwardRef<HTMLDivElement, BlogCardsSectionProps>(({
    posts,
    featuredPost,
}, ref) => (
    <div ref={ref} className={styles.root}>
        {featuredPost ? <FeaturedBlogCard post={featuredPost} /> : null}
        {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
        ))}
    </div>
));

BlogCardsSection.displayName = 'BlogCardsSection';

export default BlogCardsSection;

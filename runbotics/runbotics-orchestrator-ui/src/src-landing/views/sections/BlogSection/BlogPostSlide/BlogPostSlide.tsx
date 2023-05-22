import { FC } from 'react';

import FeaturedBlogCard from '#src-landing/components/FeaturedBlogCard';

import styles from './BlogPostSlide.module.scss';
import { BlogPostSlideProps } from './BlogPostSlide.types';

const BlogPostSlide: FC<BlogPostSlideProps> = ({ post }) => (
    <FeaturedBlogCard
        className={styles.root}
        post={post}
        brief
    />
);

export default BlogPostSlide;

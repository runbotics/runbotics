import { VFC } from 'react';

import { BlogPost } from '#contentful/common';
import BlogCard from '#src-landing/components/BlogCard';
import MediaScroller from '#src-landing/components/MediaScroller';

import styles from './BlogPostCarousel.module.scss';

interface Props {
    posts: BlogPost[];
}

const BlogPostCarousel: VFC<Props> = ({ posts }) => {
    const slides = posts.map((post) => (
        <BlogCard
            key={post.slug}
            className={styles.blogCard}
            post={post}
        />
    ));

    return (
        <MediaScroller className={styles.mediaScroller}>
            {slides}
        </MediaScroller>
    );
};

export default BlogPostCarousel;

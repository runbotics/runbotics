import { VFC } from 'react';

import { BlogPost } from '#contentful/common';
import Carousel from '#src-landing/components/Carousel/Carousel';

import BlogPostSlide from '../BlogPostSlide';
import styles from './BlogPostCarousel.module.scss';

interface Props {
    posts: BlogPost[];
}

const BlogPostCarousel: VFC<Props> = ({ posts }) => {
    const slides = posts.map((post, index) => (
        <BlogPostSlide
            key={post.slug}
            index={index}
            post={post}
        />
    ));

    return (
        <Carousel
            slides={slides}
            styles={styles}
            hasCSSSlider
            hideControlsOnEdge
        />
    );
};

export default BlogPostCarousel;

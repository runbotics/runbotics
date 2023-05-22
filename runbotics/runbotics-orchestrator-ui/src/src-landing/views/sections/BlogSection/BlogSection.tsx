import type { VFC } from 'react';

import { BlogPost } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { BLOG_SECTION_ID } from '#src-landing/utils/utils';

import BlogButton from './BlogButton/BlogButton';
import BlogPostCarousel from './BlogPostCarousel/BlogPostCarousel';
import styles from './BlogSection.module.scss';
import { BLOG_SECTION_TITLE_ID } from './BlogSection.utils';

interface Props {
    posts: BlogPost[];
}

const BlogSection: VFC<Props> = ({ posts }) => {
    const { translate } = useTranslations();

    return (
        <section
            className={styles.root}
            id={BLOG_SECTION_ID}
            aria-labelledby={BLOG_SECTION_TITLE_ID}
        >
            <div className={styles.title}>
                <Typography variant="h2" id={BLOG_SECTION_TITLE_ID}>
                    {translate('Landing.Blog.Title.Part.1')}
                </Typography>
                <Typography variant="h6">
                    {translate('Landing.Blog.Title.Part.2')}
                </Typography>
            </div>
            <div className={styles.background}></div>
            <BlogPostCarousel posts={posts}/>
            <div className={styles.blogButtonWrapper}>
                <div />
                <BlogButton />
                <div />
            </div>
        </section>
    );
};

export default BlogSection;

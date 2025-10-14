import { useEffect, type VFC } from 'react';

import { BlogPost } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { ENTERED_PAGE } from '#src-app/utils/Mixpanel/types';
import { recordPageEntrance } from '#src-app/utils/Mixpanel/utils';
import LinkButton from '#src-landing/components/LinkButton';
import Typography from '#src-landing/components/Typography';
import { BLOG_SECTION_ID } from '#src-landing/utils/utils';

import BlogPostCarousel from './BlogPostCarousel/BlogPostCarousel';
import styles from './BlogSection.module.scss';
import { BLOG_SECTION_TITLE_ID } from './BlogSection.utils';

interface Props {
    posts: BlogPost[];
}

const BlogSection: VFC<Props> = ({ posts }) => {
    const { translate } = useTranslations();
    useEffect(() => {
        recordPageEntrance({ enteredPage: ENTERED_PAGE.BLOG });
    },  []);

    return (
        <section
            id={BLOG_SECTION_ID}
            aria-labelledby={BLOG_SECTION_TITLE_ID}
            className={styles.blogSection}
        >
            <div className={styles.blogTitle}>
                <Typography className={styles.mainTitle} variant="h2" id={BLOG_SECTION_TITLE_ID}>
                    {translate('Landing.Blog.Title.Part.1')}
                </Typography>
                <Typography className={styles.subtitle} variant="h6">
                    {translate('Landing.Blog.Title.Part.2')}
                </Typography>
                <div className={styles.blogButtonWrapper}>
                    <LinkButton href={'/blog'} title={translate('Landing.Blog.Link.Title')} />
                </div>
            </div>
            <div className={styles.background}></div>
            <If condition={posts.length > 0}>
                <BlogPostCarousel posts={posts}/>
            </If>
        </section>
    );
};

export default BlogSection;

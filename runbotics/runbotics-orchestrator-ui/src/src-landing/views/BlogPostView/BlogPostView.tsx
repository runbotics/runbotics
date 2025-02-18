import { VFC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '#contentful/common';
import TagIcon from '#public/images/icons/category_label.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import BlogSharePanel from '#src-landing/components/BlogSharePanel';
import Layout from '#src-landing/components/Layout';
import PostHeader from '#src-landing/components/PostHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';
import Typography from '#src-landing/components/Typography';

import styles from './BlogPostView.module.scss';
import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';

interface Props {
    post: BlogPost;
}

const BlogPostView: VFC<Props> = ({ post }) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { body, summary, slug: postSlug, tags: postTags, ...postHeaderProps } = post;
    const { translate } = useTranslations();

    const tags = postTags.items.map(({ name, slug }) => (
        <Link key={name} href={`/blog?tag=${slug}`} className={styles.tagLink}>
            {`${name}`}
        </Link>
    ));

    return (
        <Layout>
            <div className={styles.blogWrapper}>
                <PostHeader {...postHeaderProps} />
                <div className={styles.breadCrumbsWrapper}>
                    <BreadcrumbsSection subPageTitle={post.title} />
                </div>
                <article className={styles.contentArticle}>
                    <RichTextRenderer content={body} />
                    <div className={styles.tagsWrapper}>
                        <Image
                            src={TagIcon}
                            width={24}
                            height={24}
                            className={styles.tag}
                            alt="tag icon"
                        />
                        <Typography
                            font="Roboto"
                            className={`${styles.h4} ${styles.tag}`}
                            variant="h4"
                        >
                            {translate('Blog.Post.Tags')}
                        </Typography>
                        {tags}
                    </div>
                    <BlogSharePanel />
                </article>
            </div>
        </Layout>
    );
};

export default BlogPostView;

import { VFC } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BlogPost, FilterQueryParamsEnum, getBlogUrl } from '#contentful/common';
import BlogSharePanel from '#src-landing/components/BlogSharePanel';
import Layout from '#src-landing/components/Layout';
import PostHeader from '#src-landing/components/PostHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';
import Typography from '#src-landing/components/Typography';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import styles from './BlogPostView.module.scss';

interface Props {
    post: BlogPost;
}

const BlogPostView: VFC<Props> = ({ post }) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { body, summary, slug: postSlug, tags, ...postHeaderProps } = post;
    const { push } = useRouter();

    const onLinkClick = (slug: string) => {
        const searchParams = new URLSearchParams();
        searchParams.append(FilterQueryParamsEnum.Tag, slug);
        const newUrl = getBlogUrl(searchParams);

        push(newUrl);
    }
    const tagsArr = tags.items.map(({ name, slug }) => (
        <Link key={name} href={`/blog?tag=${slug}`} className={styles.tagLink} onClick={() => onLinkClick(slug)}>
            {`${name}`}
        </Link>
    ));

    return (
        <>
            <Head>
                <title>{`${post.title} | Runbotics Blog`}</title>
                <meta property="og:image" content={post.featuredImage?.url} />
            </Head>
            <Layout>
                <div className={styles.blogWrapper}>
                    <PostHeader {...postHeaderProps} />
                    <div className={styles.breadCrumbsWrapper}>
                        <BreadcrumbsSection postTitle={post.title} />
                    </div>
                    <article className={styles.contentArticle}>
                        <RichTextRenderer content={body} />
                        <div className={styles.tagsWrapper} >
                            <Typography font="Roboto" className={styles.h4} variant="h4">Tags:</Typography>
                            {tagsArr}
                        </div>
                        <BlogSharePanel />
                    </article>
                </div>
            </Layout>
        </>
    );
};

export default BlogPostView;

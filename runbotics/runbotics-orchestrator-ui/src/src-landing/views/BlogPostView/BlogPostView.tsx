import { VFC } from 'react';

import Head from 'next/head';

import { BlogPost } from '#contentful/common';
import BlogSharePanel from '#src-landing/components/BlogSharePanel';
import Layout from '#src-landing/components/Layout';
import PostHeader from '#src-landing/components/PostHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import styles from './BlogPostView.module.scss';

interface Props {
    post: BlogPost;
}

const BlogPostView: VFC<Props> = ({ post }) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { body, summary, slug, ...postHeaderProps} = post;
    return (
        <>
            <Head>
                <title>
                    {`${post.title} | Runbotics Blog`}
                </title>
                <meta property="og:image" content={post.featuredImage?.url} />
            </Head>
            <Layout>
                <article className={styles.blogArticle}>
                    <BreadcrumbsSection />
                    <PostHeader
                        {...postHeaderProps}
                    />
                    <div style={{ height: '100px' }}>
                        {/* TODO: breadcrumbs */}
                    </div>
                    <section className={styles.contentSection}>
                        <RichTextRenderer content={body} />
                        <BlogSharePanel />
                    </section>
                </article>
            </Layout>
        </>
    );
};

export default BlogPostView;

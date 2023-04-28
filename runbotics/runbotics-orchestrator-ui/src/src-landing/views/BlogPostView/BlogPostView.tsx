import { VFC } from 'react';

import Head from 'next/head';

import { BlogPost } from '#contentful/models';
import BlogSharePanel from '#src-landing/components/BlogSharePanel';
import Layout from '#src-landing/components/Layout';
import PostHeader from '#src-landing/components/PostHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';

import styles from './BlogPostView.module.scss';

interface Props {
    post: BlogPost;
}

const BlogPostView: VFC<Props> = ({ post }) => (
    <>
        <Head>
            <title>
                {`${post.title} | Runbotics Blog`}
            </title>
            <meta property="og:image" content={post.featuredImage.url} />
        </Head>
        <Layout>
            <article className={styles.blogArticle}>
                <PostHeader
                    imageUrl={post.featuredImage.url}
                    title={post.title}
                    date={post.date}
                    tags={post.tags}
                    category={post.category}
                    authors={post.authors}
                />
                <div style={{ height: '100px' }}>
                    {/* TODO: breadcrumbs */}
                </div>
                <section className={styles.contentSection}>
                    <RichTextRenderer content={post.body} />
                    <BlogSharePanel />
                </section>
            </article>
        </Layout>
    </>
);

export default BlogPostView;

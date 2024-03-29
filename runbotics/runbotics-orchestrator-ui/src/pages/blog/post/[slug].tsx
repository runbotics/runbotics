import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { isCached, recreateCache } from '#contentful/blog-main';
import { getSinglePostCache } from '#contentful/blog-post';
import { BlogPost } from '#contentful/common';
import backupRunBoticsImage from '#public/images/banners/hero-background.png';
import { Language } from '#src-app/translations/translations';
import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import BlogPostView from '#src-landing/views/BlogPostView';

interface Props {
    post: BlogPost;
}

const Post: VFC<Props> = ({ post }) => <BlogPostView post={post} />;

export default Post;

interface Params extends Record<string, string> {
    slug: string;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, locale, res }) => {
    const language = locale as Language;

    if (!isCached(language)) {
        await recreateCache();
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const post = getSinglePostCache(language, params.slug);

    if (!post) {
        return {
            notFound: true,
        };
    }

    const metadata: MetadataTags = {
        title: `${post.title} | Runbotics Blog`,
        description: post.summary,
        image: post.featuredImage?.url ?? backupRunBoticsImage.src,
    };

    return {
        props: {
            post,
            metadata,
        },
    };
};

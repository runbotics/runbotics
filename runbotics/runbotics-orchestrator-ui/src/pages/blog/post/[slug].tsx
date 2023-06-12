import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import {
    getSinglePostCache,
    isCacheUpToDate,
    recreateCache,
    setSinglePostCache,
} from '#contentful/blog-main';
import { getPost } from '#contentful/blog-post';
import { BlogPost } from '#contentful/common';
import { Language } from '#src-app/translations/translations';
import BlogPostView from '#src-landing/views/BlogPostView';

interface Props {
    post: BlogPost;
}

const Post: VFC<Props> = ({ post }) => <BlogPostView post={post} />;

export default Post;

interface Params extends Record<string, string> {
    slug: string;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
    res,
    params,
    locale,
}) => {
    let post: BlogPost | undefined;

    if (isCacheUpToDate((locale ? locale : 'en') as Language)) {
        post = getSinglePostCache(locale as Language, params.slug);
        res.setHeader('X-Cache', 'HIT');
    } else {
        recreateCache(locale as Language);
    }

    if (!post) {
        post = await getPost(locale as Language, { slug: params.slug });
    }

    if (post) {
        setSinglePostCache(locale as Language, post);
    } else {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
    };
};

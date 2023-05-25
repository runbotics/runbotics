import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getSinglePostCache, isCacheUpToDate, recreateCache, setSinglePostCache } from '#contentful/blog-main';
import { getPost } from '#contentful/blog-post';
import { BlogPost } from '#contentful/common';
import BlogPostView from '#src-landing/views/BlogPostView';

interface Props {
    post: BlogPost;
}

const Post: VFC<Props> = ({ post }) => <BlogPostView post={post} />;
  
export default Post;

interface Params extends Record<string, string> {
    slug: string;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ res, params }) => {
    let post: BlogPost | undefined;

    if (isCacheUpToDate()) {
        post = getSinglePostCache(params.slug);
        res.setHeader('X-Cache', 'HIT');
    } else {
        recreateCache();
    }

    if (!post) {
        post = await getPost({ slug: params.slug });
    }

    if (post) {
        setSinglePostCache(post);
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

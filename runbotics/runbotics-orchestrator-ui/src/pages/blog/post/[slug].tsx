import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getSinglePostCache, isCacheUpToDate, recreateCache } from '#contentful/blog-main';
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
    } else {
        recreateCache();
    }

    if (!post) {
        post = await getPost({ slug: params.slug });
    }

    if (!post) {
        return {
            notFound: true
        };
    }
    
    res.setHeader('X-Cache', 'HIT');
    return {
        props: {
            post,
        },
    };
};

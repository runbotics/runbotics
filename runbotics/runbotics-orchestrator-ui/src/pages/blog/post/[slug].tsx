import { GetServerSidePropsContext } from 'next';

import { getPost, getPostCache, setPostCache } from '#contentful/blog-post';
import { BlogPost } from '#contentful/common';
import BlogPostView from '#src-landing/views/BlogPostView';

interface Props {
    post: BlogPost;
}

const Post = ({ post }: Props) => <BlogPostView post={post} />;
  
export default Post;

interface Params extends Record<string, string> {
    slug: string;
}

export async function getServerSideProps({ res, params }: GetServerSidePropsContext<Params>) {
    let postResponse = getPostCache(params.slug);

    if (!postResponse) {
        postResponse = await getPost({ slug: params.slug });
        setPostCache(params.slug, postResponse);
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const { post } = postResponse;

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: { 
            post,
        },
    };
}

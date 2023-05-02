
import { GetServerSidePropsContext } from 'next';

import { getPost } from '#contentful/api';
import contentfulCache from '#contentful/cache';
import { BlogPost } from '#contentful/models';
import BlogPostView from '#src-landing/views/BlogPostView';

interface Props {
    post: BlogPost;
}

const Post = ({ post }: Props) => <BlogPostView post={post} />;
  
export default Post;

interface Params extends Record<string, string> {
    slug: string;
}
type PostResponse = Awaited<ReturnType<typeof getPost>>

export async function getServerSideProps(context: GetServerSidePropsContext<Params>) {
    const { res, params } = context;
    const cacheKey = params.slug;
    let postResponse = contentfulCache.get(cacheKey) as PostResponse | undefined;

    if (!postResponse) {
        postResponse = await getPost({ slug: params.slug });
        contentfulCache.set(cacheKey, postResponse);
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

import { GetServerSidePropsContext } from 'next';

import BlogView from '#src-landing/views/BlogView';
import { getAllPosts } from 'src/contentful/api';
import contentfulCache from 'src/contentful/cache';
import { BlogPost } from 'src/contentful/models';

interface BlogPageProps {
    posts: BlogPost[];
}

const BlogPage = ({ posts }: BlogPageProps) => <BlogView posts={posts} />;

export default BlogPage;

type PostsResponse = Awaited<ReturnType<typeof getAllPosts>>;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const cacheKey = 'blog';
    let postsResponse = contentfulCache.get(cacheKey) as
        | PostsResponse
        | undefined;

    if (!postsResponse) {
        postsResponse = await getAllPosts();
        contentfulCache.set(cacheKey, postsResponse);
    } else {
        context.res.setHeader('X-Cache', 'HIT');
    }

    const { posts } = postsResponse;

    return {
        props: {
            posts: posts ?? [],
        },
    };
}

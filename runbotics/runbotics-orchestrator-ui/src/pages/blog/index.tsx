
import { Card, CardActions, CardContent, CardHeader, Chip } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import NextLink from 'next/link';

import Layout from '#src-landing/components/Layout';
import HeroSection from '#src-landing/views/sections/HeroSection';

import { getAllPosts } from 'src/contentful/api';
import contentfulCache from 'src/contentful/cache';
import { BlogPost } from 'src/contentful/models';

interface Props {
    posts: BlogPost[];
}

const BlogPage = ({ posts }: Props) => (
    <Layout>
        <HeroSection />
        {posts?.map(post => (
            <Card key={post.slug}>
                <CardHeader
                    title={post.title}
                />
                <CardContent>
                    <div>
                        {post.date}
                        {post.categories.items.map(category => (
                            <Chip key={category.slug} label={category.title} />
                        ))}
                    </div>
                    {post.summary}
                </CardContent>
                <CardActions>
                    <NextLink href={`/blog/${post.slug}`}>Read More</NextLink>
                </CardActions>
            </Card>
        ))}
    </Layout>
);

export default BlogPage;

type PostsResponse = Awaited<ReturnType<typeof getAllPosts>>

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const cacheKey = 'blog';
    let postsResponse = contentfulCache.get(cacheKey) as PostsResponse | undefined;

    if (!postsResponse) {
        postsResponse = await getAllPosts();
        contentfulCache.set(cacheKey, postsResponse);
    } else {
        context.res.setHeader('X-Cache', 'HIT');
    }

    const { posts } = postsResponse;

    return {
        props: { 
            posts: posts ?? []
        },
    };
}


import { Card, CardActions, CardContent, CardHeader, Chip } from '@mui/material';
import NextLink from 'next/link';

import Layout from '#src-landing/components/Layout';
import HeroSection from '#src-landing/views/sections/HeroSection';

import { getAllPosts } from 'src/contentful/api';
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

export async function getStaticProps() {
    const { posts } = await getAllPosts();

    return {
        props: { 
            posts: posts ?? []
        },
    };
}

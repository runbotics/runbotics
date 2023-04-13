import { Chip, Typography } from '@mui/material';

import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import Layout from '#src-landing/components/Layout';
import RichTextRenderer from '#src-landing/components/Renderer/renderer';

import { getPost } from 'src/contentful/api';
import contentfulCache from 'src/contentful/cache';
import { BlogPost } from 'src/contentful/models';

interface Props {
    post: BlogPost;
}

const Post = ({ post }: Props) => {
    if (!post) {
        return '404';
    }
  
    return (
        <Layout>
            <article>
                <Head>
                    <title>
                        {`${post.title} | Runbotics Blog`}
                    </title>
                    <meta property="og:image" content={post.featuredImage.url} />
                </Head>
                <img src={post.featuredImage.url} alt=''/>
                <div>
                    {post.tags?.map(tag => (
                        <Chip key={tag} label={tag} />
                    ))}
                </div>
                <Typography variant="h1">{post.title}</Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <div>
                        {post.date}
                    </div>
                    <div>
                        {post.categories.items.map(category => (
                            <Chip key={category.slug} label={category.title} />
                        ))}
                    </div>
                    <div>
                        {post.authors.items.map(author => author.name)}
                    </div>
                </div>
                <RichTextRenderer content={post.body} />
            </article>
        </Layout>
    );
};
  
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

    return {
        props: { 
            post: post ?? null
        },
    };
}

import { Chip, Typography } from '@mui/material';

import Head from 'next/head';

import Layout from '#src-landing/components/Layout';
import RichTextRenderer from '#src-landing/components/Renderer/renderer';

import { getAllPostsPaths, getPost } from 'src/contentful/api';
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

export async function getStaticProps({ params }) {
    const { post } = await getPost({ slug: params.slug });

    return {
        props: {
            post: post ?? null,
        },
    };
}

export async function getStaticPaths() {
    const { paths } = await getAllPostsPaths();
    
    return {
        paths: paths?.map(({ slug }) => ({ params: { slug }})) ?? [],
        fallback: true,
    };
}

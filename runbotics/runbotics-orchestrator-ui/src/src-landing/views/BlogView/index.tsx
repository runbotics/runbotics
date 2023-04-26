import { FC } from 'react';

import BlogLayout from '#src-landing/components/BlogLayout/BlogLayout';
import Layout from '#src-landing/components/Layout';
import { BlogPost } from 'src/contentful/models';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection';

interface BlogViewProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, featuredPost }) => (
    <Layout>
        <BlogLayout>
            <BreadcrumbsSection />
            <FiltersSection />
            <CardsSection posts={posts} featuredPost={featuredPost} />
        </BlogLayout>
    </Layout>
);

export default BlogView;

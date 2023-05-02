import { FC } from 'react';

import { BlogPost, Category } from '#contentful/common';
import BlogLayout from '#src-landing/components/BlogLayout/BlogLayout';
import Layout from '#src-landing/components/Layout';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection';

interface BlogViewProps {
    posts: BlogPost[];
    categories: Category[];
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, featuredPost }) => (
    <Layout>
        <BlogLayout>
            <BreadcrumbsSection />
            <FiltersSection categories={categories} />
            <CardsSection posts={posts} featuredPost={featuredPost} />
        </BlogLayout>
    </Layout>
);

export default BlogView;

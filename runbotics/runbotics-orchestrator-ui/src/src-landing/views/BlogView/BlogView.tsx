import { FC } from 'react';

import BlogLayout from '#src-landing/components/BlogLayout/BlogLayout';
import Layout from '#src-landing/components/Layout';
import { BlogPost, Category, Tag } from 'src/contentful/models';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection';

interface BlogViewProps {
    posts: BlogPost[];
    categories: Category[];
    tags: Tag[];
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, tags, featuredPost }) => (
    <Layout>
        <BlogLayout>
            <BreadcrumbsSection />
            <FiltersSection categories={categories} tags={tags} />
            <CardsSection posts={posts} featuredPost={featuredPost} />
        </BlogLayout>
    </Layout>
);

export default BlogView;

import { FC } from 'react';

import BlogLayout from '#src-landing/components/BlogLayout/BlogLayout';
import Layout from '#src-landing/components/Layout';
import { BlogPost } from 'src/contentful/models';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection/FiltersSection';

interface Props {
    posts: BlogPost[];
}

const BlogView: FC<Props> = ({ posts }) => (
    <Layout>
        <BlogLayout>
            <BreadcrumbsSection />
            <FiltersSection />
            <CardsSection posts={posts}></CardsSection>
        </BlogLayout>
    </Layout>
);

export default BlogView;

import { FC, useRef } from 'react';

import { BlogPost, Category } from '#contentful/common';
import BlogLayout from '#src-landing/components/BlogLayout';
import Layout from '#src-landing/components/Layout';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection';

interface BlogViewProps {
    posts: BlogPost[];
    categories: Category[];
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, featuredPost }) => {
    const cardsSectionRef = useRef<HTMLDivElement>(null);

    return (
        <Layout>
            <BlogLayout>
                <BreadcrumbsSection />
                <FiltersSection
                    categories={categories}
                    onReload={() => {
                        cardsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                />
                <CardsSection
                    ref={cardsSectionRef}
                    posts={posts}
                    featuredPost={featuredPost}
                />
            </BlogLayout>
        </Layout>
    );
};

export default BlogView;

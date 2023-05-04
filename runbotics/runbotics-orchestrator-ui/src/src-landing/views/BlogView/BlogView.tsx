import { FC, useRef } from 'react';

import { BlogPost, Category } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import BlogLayout from '#src-landing/components/BlogLayout';
import Layout from '#src-landing/components/Layout';
import Typography from '#src-landing/components/Typography';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection';
import styles from './BlogView.module.scss';

interface BlogViewProps {
    posts: BlogPost[];
    categories: Category[];
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, featuredPost }) => {
    const { translate } = useTranslations();
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
                {posts.length
                    ? (
                        <CardsSection
                            ref={cardsSectionRef}
                            posts={posts}
                            featuredPost={featuredPost}
                        />)
                    : (
                        <div className={styles.emptyPageContentWrapper}>
                            <Typography variant='h3'>
                                {translate('Landing.Blog.EmptyPage.Title')}
                            </Typography>
                        </div>)
                }
            </BlogLayout>
        </Layout>
    );
};

export default BlogView;

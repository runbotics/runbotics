import { FC, useRef } from 'react';

import { BlogPost, Category } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import BlogLayout from '#src-landing/components/BlogLayout';
import Layout from '#src-landing/components/Layout';
import PostsPagination from '#src-landing/components/PostPagination';
import Typography from '#src-landing/components/Typography';

import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import FiltersSection from '../sections/blog/FiltersSection';
import styles from './BlogView.module.scss';

interface BlogViewProps {
    posts: BlogPost[];
    categories: Category[];
    featuredPost?: BlogPost;
    currentPage: number;
    totalPages: number;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, featuredPost, currentPage, totalPages }) => {
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
                    ? <PostsPagination 
                        posts={posts} 
                        featuredPost={featuredPost} 
                        cardsSectionRef={cardsSectionRef} 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                    />
                    : (
                        <div className={styles.emptyPageContentWrapper}>
                            <Typography variant='h3'>
                                {translate('Landing.Blog.EmptyPage.Title')}
                            </Typography>
                        </div>
                    )
                }
            </BlogLayout>
        </Layout>
    );
};

export default BlogView;

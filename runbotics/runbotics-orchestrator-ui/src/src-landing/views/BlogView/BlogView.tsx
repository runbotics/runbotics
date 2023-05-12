import { FC } from 'react';

import { BlogPost, Category, Page, Tag } from '#contentful/common';
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
    tags: Tag[];
    page: Page;
    featuredPost?: BlogPost;
    currentPage: number;
    postsPerPage: number;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, tags, page, featuredPost }) => {
    const { translate } = useTranslations();

    return (
        <Layout>
            <BlogLayout>
                <BreadcrumbsSection />
                <FiltersSection
                    categories={categories}
                    tags={tags}
                />
                {posts.length
                    ? <PostsPagination 
                        posts={posts} 
                        featuredPost={featuredPost} 
                        cardsSectionRef={cardsSectionRef} 
                        currentPage={currentPage} 
                        postsPerPage={postsPerPage}
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

import { FC } from 'react';

import { BlogPost, Category, Page, Tag } from '#contentful/common';
import If from '#src-app/components/utils/If';
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
    tags: Tag[];
    page: Page;
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, tags, page, featuredPost }) => {
    const { translate } = useTranslations();

    const postsNotFoundInfo = (
        <div className={styles.emptyPageContentWrapper}>
            <Typography variant='h3'>
                {translate('Blog.EmptyPage.Title')}
            </Typography>
        </div>
    );

    return (
        <Layout>
            <BlogLayout>
                <BreadcrumbsSection />
                <FiltersSection
                    categories={categories}
                    tags={tags}
                />
                <If condition={Boolean(posts.length)} else={postsNotFoundInfo}>
                    <CardsSection
                        posts={posts}
                        featuredPost={featuredPost}
                        page={page}
                    />
                </If>
            </BlogLayout>
        </Layout>
    );
};

export default BlogView;

import { FC, useState } from 'react';

import Image from 'next/image';

import { BlogPost, Category, Page, Tag } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import Layout from '#src-landing/components/Layout';
import Typography from '#src-landing/components/Typography';
import ContentFulLayout from 'src/src-landing/components/ContentFulLayout';

import styles from './BlogView.module.scss';
import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
import CardsSection from '../sections/blog/CardsSection';
import FiltersSection from '../sections/blog/FiltersSection';


interface BlogViewProps {
    posts: BlogPost[];
    categories: Category[];
    tags: Tag[];
    page: Page;
    featuredPost?: BlogPost;
}

const BlogView: FC<BlogViewProps> = ({ posts, categories, tags, page, featuredPost }) => {
    const [isFilterDisplayed, setFilterDisplayed] = useState(false);

    const { translate } = useTranslations();

    const postsNotFoundInfo = (
        <div className={styles.emptyPageContentWrapper}>
            <Typography variant='h3'>
                {translate('Blog.EmptyPage.Title')}
            </Typography>
        </div>
    );

    return (
        <Layout disableScroll={isFilterDisplayed}>
            <ContentFulLayout>
                <BreadcrumbsSection/>
                <button onClick={() => setFilterDisplayed(true)} className={styles.filter}>
                    <Image alt='filterIcon' src={'/images/icons/filter.svg'} fill={true}/>
                </button>
                <FiltersSection
                    isFilterDisplayed={isFilterDisplayed}
                    handleFilterDisplayed={setFilterDisplayed}
                    categories={categories}
                    tags={tags}
                />
                <If condition={Boolean(posts.length) || Boolean(featuredPost)} else={postsNotFoundInfo}>
                    <CardsSection
                        posts={posts}
                        featuredPost={featuredPost}
                        page={page}
                    />
                </If>
            </ContentFulLayout>
        </Layout>
    );
};

export default BlogView;

import { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getBlogMainCache } from '#contentful/blog-main';

import {
    BlogPost,
    Category,
    DEFAULT_PAGE_SIZE,
    FILTER_QUERY_PARAMS,
    Tag,
    filterPosts,
    extractFilterQueryParams,
    hasQueryParams,
    Page,
    FilterQueryParamsEnum, recreateCache, isCached,
} from '#contentful/common';

import BlogBg from '#public/images/banners/blog-header.png';
import { Language } from '#src-app/translations/translations';

import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import BlogView from '#src-landing/views/BlogView';
interface Props {
    posts: BlogPost[];
    categories: Category[];
    tags: Tag[];
    page: Page;
    featuredPost?: BlogPost;
}

const BlogPage: VFC<Props> = ({ posts, categories, tags, page, featuredPost }) => (
    <BlogView
        posts={posts}
        categories={categories}
        tags={tags}
        page={page}
        featuredPost={featuredPost}
    />
);

export default BlogPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, locale, res }) => {
    const language = locale as Language;

    if (!isCached(language)) {
        await recreateCache(language);
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const cache = getBlogMainCache(language);

    const metadata: MetadataTags = {
        title: 'RunBotics | Blog',
        description: 'RunBotics - Blog',
        image: BlogBg.src,
    };

    if (hasQueryParams(query, FILTER_QUERY_PARAMS)) {
        const queryParams = extractFilterQueryParams(query);

        const isMoreThanPage = Object.keys(queryParams).length > 1
            || !Object.keys(queryParams).includes(FilterQueryParamsEnum.Page);
        const filteredPosts = filterPosts(cache.posts, queryParams);
        const currentPage = queryParams.page && queryParams.page > 1 ? queryParams.page : 1;
        const totalPages = Math.ceil(filteredPosts.length / DEFAULT_PAGE_SIZE);

        const firstPageElementIndex = (currentPage - 1) * DEFAULT_PAGE_SIZE;
        const regularPosts = isMoreThanPage ? filteredPosts : (filteredPosts?.slice(1) ?? []);
        const currentPagePosts = regularPosts?.slice(firstPageElementIndex, currentPage * DEFAULT_PAGE_SIZE) ?? [];

        return {
            props: {
                ...cache,
                metadata,
                posts: currentPagePosts,
                featuredPost: !isMoreThanPage && currentPage === 1 ? cache.featuredPost : null,
                page: {
                    current: currentPage,
                    total: totalPages,
                }
            },
        };
    }

    const posts = cache?.posts;
    const regularPosts = posts?.slice(1) ?? [];
    const totalPages = Math.ceil(regularPosts.length / DEFAULT_PAGE_SIZE);

    return {
        props: {
            ...cache,
            metadata,
            posts: regularPosts.slice(0, DEFAULT_PAGE_SIZE),
            page: {
                current: 1,
                total: totalPages,
            }
        },
    };
};

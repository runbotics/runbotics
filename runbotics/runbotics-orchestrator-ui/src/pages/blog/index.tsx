import { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getBlogMainCache, recreateCache
} from '#contentful/blog-main';
import {
    BlogPost, Category, DEFAULT_PAGE_SIZE, FILTERED_PAGE_SIZE, FILTER_QUERY_PARAMS, Tag, filterPosts, extractFilterQueryParams, hasQueryParams, Page
} from '#contentful/common';
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
    let cache = getBlogMainCache();
    
    if (!cache) {
        cache = await recreateCache();
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    if (hasQueryParams(query, FILTER_QUERY_PARAMS)) {
        const queryParams = extractFilterQueryParams(query);
        const filteredPosts = filterPosts(cache.posts, queryParams);
        const totalPages = Math.ceil(filteredPosts.length / FILTERED_PAGE_SIZE);
        const currentPage = query.page ? Number(query.page) : 1;
        const firstPageElementIndex = (currentPage - 1) * FILTERED_PAGE_SIZE;

        return {
            props: {
                ...cache,
                posts: filteredPosts.slice(firstPageElementIndex, currentPage * FILTERED_PAGE_SIZE) ?? [],
                featuredPost: null,
                page: {
                    current: currentPage,
                    total: totalPages,
                }
            },
        };
    }

    const { posts } = cache;
    const regularPosts = posts.slice(1);
    const totalPages = Math.ceil(regularPosts.length / DEFAULT_PAGE_SIZE);

    return {
        props: {
            ...cache,
            posts: regularPosts.slice(0, DEFAULT_PAGE_SIZE),
            page: {
                current: 1,
                total: totalPages,
            }
        },
    };
};

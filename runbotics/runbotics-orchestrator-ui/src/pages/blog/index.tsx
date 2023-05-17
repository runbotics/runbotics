import { VFC } from 'react';

import { GetServerSidePropsContext } from 'next';

import {
    getFilteredPosts, getBlogPostsCache, buildFilterFragment,
    setBlogPostsCache, getAllPosts
} from '#contentful/blog-main';
import {
    BlogPost, Category, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, FILTER_QUERY_PARAMS, extractFilterQueryParams,
    getPaginationSize, hasQueryParams
} from '#contentful/common';
import BlogView from '#src-landing/views/BlogView';

interface BlogPageProps {
    posts: BlogPost[];
    categories: Category[];
    featuredPost?: BlogPost;
    currentPage: number;
    totalPages: number;
}

const BlogPage: VFC<BlogPageProps> = ({ posts, categories, featuredPost, currentPage, totalPages }) => (
    <BlogView
        posts={posts}
        categories={categories}
        featuredPost={featuredPost}
        currentPage={currentPage}
        totalPages={totalPages}
    />
);

export default BlogPage;

export async function getServerSideProps({ query, res }: GetServerSidePropsContext) {
    if (hasQueryParams(query, FILTER_QUERY_PARAMS)) {
        const queryParams = extractFilterQueryParams(query);
        const { page } = queryParams;
        const { limit, skip } = getPaginationSize(page);
        const { posts, categories, pagination } = await getFilteredPosts(
            buildFilterFragment(queryParams),
            { limit, skip },
        );
        const totalPages = Math.ceil(pagination.total / DEFAULT_PAGE_SIZE) ?? DEFAULT_PAGE;
        const currentPage = page ? Number(page) : DEFAULT_PAGE;

        return {
            props: {
                posts: posts ?? [],
                categories: categories ?? [],
                currentPage,
                totalPages,
            },
        };
    }

    let postsResponse = getBlogPostsCache();

    if (!postsResponse) {
        postsResponse = await getAllPosts();
        setBlogPostsCache(postsResponse);
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const { posts, featuredPost, categories, pagination } = postsResponse;
    const totalPages = Math.ceil(pagination.total / DEFAULT_PAGE_SIZE);

    return {
        props: {
            posts: posts ?? [],
            featuredPost: featuredPost ?? null,
            categories: categories ?? [],
            currentPage: DEFAULT_PAGE,
            totalPages,
        },
    };
}

import { VFC } from 'react';

import { GetServerSidePropsContext } from 'next';

import {
    getFilteredPosts, getBlogPostsCache, buildFilterFragment,
    setBlogPostsCache, getAllPosts
} from '#contentful/blog-main';
import {
    BlogPost, Category, FILTER_QUERY_PARAMS, extractFilterQueryParams,
    getPaginationSize, hasQueryParams
} from '#contentful/common';
import BlogView from '#src-landing/views/BlogView';

const DEFAULT_POSTS_PER_PAGE = 1;

interface BlogPageProps {
    posts: BlogPost[];
    categories: Category[];
    featuredPost?: BlogPost;
    currentPage: number;
    postsPerPage: number;
}


const BlogPage: VFC<BlogPageProps> = ({ posts, categories, featuredPost, currentPage, postsPerPage }) => (
    <BlogView
        posts={posts}
        categories={categories}
        featuredPost={featuredPost}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
    />
);

export default BlogPage;

export async function getServerSideProps({ query, res }: GetServerSidePropsContext) {
    if (hasQueryParams(query, FILTER_QUERY_PARAMS)) {
        const queryParams = extractFilterQueryParams(query);
        const { limit, skip } = getPaginationSize(queryParams.page);
        const { posts, categories } = await getFilteredPosts(
            buildFilterFragment(queryParams),
            { limit, skip },
        );
        return {
            props: {
                posts: posts ?? [],
                categories: categories ?? [],
                limit: limit ?? DEFAULT_POSTS_PER_PAGE,
                currentPage: skip ?? 1,
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

    const { posts, featuredPost, categories } = postsResponse;

    return {
        props: {
            posts: posts ?? [],
            featuredPost: featuredPost ?? null,
            categories: categories ?? [],
            postsPerPage: DEFAULT_POSTS_PER_PAGE,
            currentPage: 2,
        },
    };
}

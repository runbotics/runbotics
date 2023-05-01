import { GetServerSidePropsContext } from 'next';

import BlogView from '#src-landing/views/BlogView';
import { getAllCategories, getAllPosts, getFilteredPosts } from 'src/contentful/api';
import contentfulCache from 'src/contentful/cache';
import { buildFilterFragment } from 'src/contentful/fragments';
import { BlogPost, Category, Tag } from 'src/contentful/models';
import { FilterQueryParamsEnum } from 'src/contentful/types';
import {
    extractFilterQueryParams,
    getPaginationSize,
    hasQueryParams,
} from 'src/contentful/utils';

interface BlogPageProps {
    posts: BlogPost[];
    categories: Category[];
    tags: Tag[];
    featuredPost?: BlogPost;
}

const BlogPage = ({ posts, categories, featuredPost, tags }: BlogPageProps) => (
    <BlogView
        posts={posts}
        categories={categories}
        tags={tags}
        featuredPost={featuredPost}
    />
);

export default BlogPage;

type PostsResponse = Awaited<ReturnType<typeof getAllPosts>>;

const FILTER_QUERY_PARAMS = [
    FilterQueryParamsEnum.Category,
    // FilterQueryParamsEnum.Tag,
    FilterQueryParamsEnum.Search,
    FilterQueryParamsEnum.StartDate,
    FilterQueryParamsEnum.EndDate,
    FilterQueryParamsEnum.Page,
];

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const categories = await getAllCategories();
    // const tags = await getAllTags();

    if (hasQueryParams(context.query, FILTER_QUERY_PARAMS)) {
        const queryParams = extractFilterQueryParams(context.query);
        const { limit, skip } = getPaginationSize(queryParams.page);
        const response = await getFilteredPosts(
            buildFilterFragment(queryParams),
            { limit, skip }
        );
        return {
            props: {
                posts: response.posts ?? [],
                categories: categories ?? [],
                tags: [],
            },
        };
    }

    const cacheKey = 'blog';
    let postsResponse = contentfulCache.get(cacheKey) as
        | PostsResponse
        | undefined;

    if (!postsResponse) {
        postsResponse = await getAllPosts();
        contentfulCache.set(cacheKey, postsResponse);
    } else {
        context.res.setHeader('X-Cache', 'HIT');
    }

    const { posts, featuredPost } = postsResponse;

    return {
        props: {
            posts: posts ?? [],
            featuredPost: featuredPost ?? null,
            categories: categories ?? [],
            tags: [],
        },
    };
}

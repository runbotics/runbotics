import { GetServerSidePropsContext } from 'next';

import BlogView from '#src-landing/views/BlogView';
import {
    getAllCategories,
    getAllPosts,
    getCategorisedPosts,
    getFilteredPosts,
} from 'src/contentful/api';
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
    featuredPost: BlogPost;
    categories: Category[];
    tags: Tag[];
}

const BlogPage = ({ posts, featuredPost, tags, categories }: BlogPageProps) => (
    <BlogView
        posts={posts}
        featuredPost={featuredPost}
        categories={categories}
        tags={tags}
    />
);

export default BlogPage;

interface Params extends Record<string, string> {
    category: string;
}

const FILTER_QUERY_PARAMS = [
    // FilterQueryParamsEnum.Tag,
    FilterQueryParamsEnum.StartDate,
    FilterQueryParamsEnum.EndDate,
    FilterQueryParamsEnum.Page,
];

type PostsResponse = Awaited<ReturnType<typeof getAllPosts>>;

export async function getServerSideProps(
    context: GetServerSidePropsContext<Params>
) {
    const categories = await getAllCategories();

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

    const cacheKey = context.params.category;

    let postsResponse = contentfulCache.get(cacheKey) as
        | PostsResponse
        | undefined;

    if (!postsResponse) {
        postsResponse = await getCategorisedPosts(cacheKey);
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

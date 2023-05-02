import { GetServerSidePropsContext } from 'next';

import BlogView from '#src-landing/views/BlogView';
import {
    getAllPosts,
    getCategorisedPosts,
    getFilteredPosts,
} from 'src/contentful/api';
import contentfulCache from 'src/contentful/cache';
import { buildFilterFragment } from 'src/contentful/fragments';
import { BlogPost } from 'src/contentful/models';
import { FilterQueryParamsEnum } from 'src/contentful/types';
import {
    extractFilterQueryParams,
    getPaginationSize,
    hasQueryParams,
} from 'src/contentful/utils';

interface BlogPageProps {
    posts: BlogPost[];
    featuredPost: BlogPost;
}

const BlogPage = ({ posts, featuredPost }: BlogPageProps) => (
    <BlogView posts={posts} featuredPost={featuredPost} />
);

export default BlogPage;

interface Params extends Record<string, string> {
    category: string;
}

const FILTER_QUERY_PARAMS = [
    FilterQueryParamsEnum.SelectedTags,
    FilterQueryParamsEnum.StartDate,
    FilterQueryParamsEnum.EndDate,
    FilterQueryParamsEnum.Page,
];

type PostsResponse = Awaited<ReturnType<typeof getAllPosts>>;
// eslint-disable-next-line complexity
export async function getServerSideProps(
    context: GetServerSidePropsContext<Params>
) {
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
        },
    };
}

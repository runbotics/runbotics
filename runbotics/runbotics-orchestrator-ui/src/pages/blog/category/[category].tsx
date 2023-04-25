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
import { extractFilterQueryParams, hasQueryParams } from 'src/contentful/utils';

interface BlogPageProps {
    posts: BlogPost[];
}

const BlogPage = ({ posts }: BlogPageProps) => <BlogView posts={posts} />;

export default BlogPage;

interface Params extends Record<string, string> {
    category: string;
}

const FILTER_QUERY_PARAMS = [
    FilterQueryParamsEnum.SelectedTags,
    FilterQueryParamsEnum.StartDate,
    FilterQueryParamsEnum.EndDate,
];

type PostsResponse = Awaited<ReturnType<typeof getAllPosts>>;
export async function getServerSideProps(
    context: GetServerSidePropsContext<Params>
) {
    if (hasQueryParams(context.query, FILTER_QUERY_PARAMS)) {
        const queryParams = extractFilterQueryParams(context.query);
        const response = await getFilteredPosts(
            buildFilterFragment(queryParams),
            {}
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

    const { posts } = postsResponse;

    return {
        props: {
            posts: posts ?? [],
        },
    };
}

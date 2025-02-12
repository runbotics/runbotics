import { GetServerSidePropsContext } from 'next';

import { BlogPost, PostStatus } from './models';
import { FilterQueryParams, FilterQueryParamsEnum } from './types';

export const DEFAULT_PAGE_SIZE = 9;
export const DRAFT_BADGE_BACKGROUND_COLOR = '#FFC107';

export const QUERY_LANGAUGE = {
    en: 'en-US',
    pl: 'pl'
};

export const FILTER_QUERY_PARAMS = [
    FilterQueryParamsEnum.Category,
    FilterQueryParamsEnum.Tag,
    FilterQueryParamsEnum.Search,
    FilterQueryParamsEnum.StartDate,
    FilterQueryParamsEnum.EndDate,
    FilterQueryParamsEnum.Page,
];

export const extractFilterQueryParams = (
    query: GetServerSidePropsContext['query']
) => {
    const result: FilterQueryParams = {};
    const { category, tag, search, startDate, endDate, page } = query;
    if (category) {
        result.categories = paramToArray(category);
    }
    if (tag) {
        result.tags = paramToArray(tag);
    }
    if (search) {
        result.search = paramToString(search);
    }
    if (startDate) {
        result.startDate = paramToString(startDate);
    }
    if (endDate) {
        result.endDate = paramToString(endDate);
    }
    if (page) {
        result.page = paramToNumber(page);
    }

    return result;
};

export const filterPosts = (posts: BlogPost[], queryParams: FilterQueryParams) => posts
    .filter(post => {
        if (!checkBlogPostMandatoryFields(post)) return false;

        const { categories, tags, startDate, endDate, search } = queryParams;

        const hasCategory = (
            !categories || categories
                ?.includes(post.category.slug)
        );
        const hasTag = (
            !tags || tags
                ?.some(
                    tag => post.tags.items
                        .map(
                            postTag => postTag.slug
                        )
                        .includes(tag)
                )
        );
        const isInTimePeriod = (
            !startDate ||
            new Date(post.date) >= new Date(startDate)
        ) && (
            !endDate ||
            new Date(post.date) <= new Date(endDate)
        );
        const containsSearchPhrase = (
            !search ||
            post.title
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                ) ||
            post.summary
                .toLowerCase()
                .includes((
                    search.toLowerCase()
                ))
        );
        return hasCategory && hasTag && isInTimePeriod && containsSearchPhrase;
    });

const paramToNumber = (param: string | string[]): number | undefined => {
    if (Array.isArray(param)) {
        const numberParam = Number(param[0]);
        return Number.isNaN(numberParam) ? undefined : numberParam;
    }

    const numberParam = Number(param);
    return Number.isNaN(numberParam) ? undefined : numberParam;
};

const paramToString = (param: string | string[]): string => {
    if (Array.isArray(param) && param.length > 0) {
        return param[0];
    }
    return param as string;
};

const paramToArray = <T>(param: string | string[]): T[] => {
    if (Array.isArray(param)) {
        return param as T[];
    }
    return [param] as T[];
};

export const hasQueryParams = (
    query: GetServerSidePropsContext['query'],
    paramsToInclude: string[]
) => paramsToInclude.some((param) => query[param]);

export const getBlogUrl = (params: URLSearchParams): string => `/blog${
    params.toString() ?
        '?' + params.toString() :
        ''
}`;

export const getPaginatedUrl = (page: number, initialParams?: string): string => {
    const searchParams = new URLSearchParams(initialParams);
    searchParams.set(FilterQueryParamsEnum.Page, String(page));
    const newUrl = getBlogUrl(searchParams);

    return newUrl;
};

export const checkIsDraft = (status: PostStatus): boolean => !status.publishedAt;

const checkBlogPostMandatoryFields = (post: BlogPost) =>
    post.category &&
    post.tags &&
    post.date &&
    post.title &&
    post.summary;

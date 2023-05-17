import { GetServerSidePropsContext } from 'next';

import { BlogPost } from './models';
import { FilterQueryParams, FilterQueryParamsEnum } from './types';

export const DEFAULT_PAGE_SIZE = 10;
export const FILTERED_PAGE_SIZE = 9;

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
        const hasCategory = (!queryParams.categories || queryParams.categories?.includes(post.category.slug));
        const hasTag = (!queryParams.tags || queryParams.tags?.some(tag => post.tags.items.map(postTag => postTag.slug).includes(tag)));
        const isInTimePeriod = (!queryParams.startDate || new Date(post.date) >= new Date(queryParams.startDate))
            && (!queryParams.endDate || new Date(post.date) <= new Date(queryParams.endDate));
        const containsSearchPhrase = (!queryParams.search || post.title.includes(queryParams.search) || post.summary.includes(queryParams.search));
        return hasCategory && hasTag && isInTimePeriod && containsSearchPhrase;
    });

const paramToNumber = (param: string | string[]): number | undefined => {
    if (Array.isArray(param)) {
        const numberParam = Number(param[0]);
        return Number.isNaN(numberParam) ? numberParam : undefined;
    }

    const numberParam = Number(param);
    return Number.isNaN(numberParam) ? numberParam : undefined;
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

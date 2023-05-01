import { GetServerSidePropsContext } from 'next';

import { FilterQueryParams } from './types';
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_OFFSET = 1;

export const extractFilterQueryParams = (
    query: GetServerSidePropsContext['query']
) => {
    const result: FilterQueryParams = {};
    const { category, search, startDate, endDate, page } = query;
    if (category) {
        result.categories = paramToArray(category);
    }
    // if (tag) {
    //     result.tags = paramToArray(tag);
    // }
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
        result.page = paramToString(page);
    }

    return result;
};

export const getPaginationSize = (page: string) => {
    if (!page) return { limit: DEFAULT_PAGE_SIZE, skip: 0 };
    const pageNumber = parseInt(page);
    const limit = pageNumber * DEFAULT_PAGE_SIZE - DEFAULT_PAGE_OFFSET;
    const skip = limit - DEFAULT_PAGE_SIZE;
    return { limit, skip };
};

const paramToString = <T>(param: string | string[]): T => {
    if (Array.isArray(param) && param.length > 0) {
        return param[0] as T;
    }
    return param as T;
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

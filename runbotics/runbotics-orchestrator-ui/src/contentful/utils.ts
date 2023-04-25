import { GetServerSidePropsContext } from 'next';

import { FilterQueryParams } from './types';
export const DEFAULT_PAGE_SIZE = 10;

// eslint-disable-next-line complexity
export const extractFilterQueryParams = (
    query: GetServerSidePropsContext['query']
) => {
    const result: FilterQueryParams = {};
    const { category, selectedTags, startDate, endDate, page } = query;
    if (category) {
        result.category = paramToString(category);
    }
    if (selectedTags) {
        result.selectedTags = paramToArray(selectedTags);
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
    const limit = pageNumber * DEFAULT_PAGE_SIZE;
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

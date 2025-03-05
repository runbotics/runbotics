import { Language } from '#src-app/translations/translations';

export interface Page {
    current: number;
    total: number;
}

export type QueryBuilder<T = {}> = (
    options: { preview?: boolean, language: Language } & T
) => string;

export type FetchContentfulResponse<T> = {
    data: T;
};

export type FilterQueryParams = {
    categories?: string[];
    tags?: string[];
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
};


export enum FilterQueryParamsEnum {
    Category = 'category',
    Tag = 'tag',
    StartDate = 'startDate',
    EndDate = 'endDate',
    Search = 'search',
    Page = 'page',
}

export enum CacheKey {
    Categories = 'categories',
    Tags = 'tags',
    Posts = 'posts',
    Offers = 'offers',
    Industries = 'industries',
    MarketplaceTags = 'marketplaceTags',
}

export interface PaginationOptions {
    skip?: number;
    limit?: number;
}

export type QueryBuilder<T = {}> = (
    options: { preview?: boolean } & T
) => string;

export type FetchContentfulResponse<T> = {
    data: T;
};

export type FilterQueryParams = {
    categories?: FilterQueryParamsEnum.Category[];
    startDate?: FilterQueryParamsEnum.StartDate;
    endDate?: FilterQueryParamsEnum.EndDate;
    search?: FilterQueryParamsEnum.Search;
    page?: FilterQueryParamsEnum.Page;
};

export enum FilterQueryParamsEnum {
    Category = 'category',
    Search = 'search',
    StartDate = 'startDate',
    EndDate = 'endDate',
    Page = 'page',
}

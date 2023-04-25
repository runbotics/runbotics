import { BlogPost } from './models';

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

export type GetAllPostsOptions = PaginationOptions;
export type GetCategorisedPostsOptions = PaginationOptions & {
    category?: string;
};

export type GetFilteredPostsOptions = PaginationOptions & {
    filterFragment?: string;
};

export type GetAllPostsResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: BlogPost[];
        skip: number;
        limit: number;
        total: number;
    };
}>;

export type GetAllPostsPathsResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: Pick<BlogPost, 'slug'>[];
    };
}>;

export interface GetPostOptions {
    slug: string;
}

export type GetPostResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: [BlogPost];
    };
}>;

export type FilterQueryParams = {
    category?: FilterQueryParamsEnum.Category;
    selectedTags?: FilterQueryParamsEnum.SelectedTags[];
    startDate?: FilterQueryParamsEnum.StartDate;
    endDate?: FilterQueryParamsEnum.EndDate;
};

export enum FilterQueryParamsEnum {
    Category = 'category',
    SelectedTags = 'selectedTags',
    StartDate = 'startDate',
    EndDate = 'endDate',
}

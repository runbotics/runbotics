import { BlogPost, Category, Tag } from './models';

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

export type GetAllCategoriesResponse = FetchContentfulResponse<{
    blogCategoryCollection: {
        items: Category[];
    }
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

export type GetAllTagsResponse = FetchContentfulResponse<{
    tagCollection: {
        items: Tag[];
    };
}>;

export type FilterQueryParams = {
    categories?: FilterQueryParamsEnum.Category[];
    // tags?: FilterQueryParamsEnum.Tag[];
    startDate?: FilterQueryParamsEnum.StartDate;
    endDate?: FilterQueryParamsEnum.EndDate;
    search?: FilterQueryParamsEnum.Search;
    page?: FilterQueryParamsEnum.Page;
};

export enum FilterQueryParamsEnum {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    Category = 'category',
    // Tag = 'tag',
    Search = 'search',
    StartDate = 'startDate',
    EndDate = 'endDate',
    Page = 'page',
}

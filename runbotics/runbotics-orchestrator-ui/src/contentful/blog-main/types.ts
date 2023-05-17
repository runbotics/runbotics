import { BlogPost, Category, FetchContentfulResponse, PaginationOptions, Tag } from '#contentful/common';

interface AllPostsCollection {
    blogPostCollection: {
        items: BlogPost[];
        skip: number;
        limit: number;
        total: number;
    }
}

export type GetAllPostsResponse = FetchContentfulResponse<
    & AllPostsCollection
    & AllCategoriesCollection
>

// Filtered Posts
export type GetFilteredPostsOptions = PaginationOptions & {
    filterFragment?: string;
};

// All Posts Paths
export type GetAllPostsPathsResponse = FetchContentfulResponse<{
    blogPostCollection: {
        items: Pick<BlogPost, 'slug'>[];
    };
}>;

// Categories
export type GetAllCategoriesResponse = FetchContentfulResponse<AllCategoriesCollection>;
interface AllCategoriesCollection {
    blogCategoryCollection: {
        items: Category[];
    }
}

interface AllTagsCollection {
    tagCollection: {
        items: Tag[];
    }
}

export type GetAllModelsResponse = FetchContentfulResponse<
    & AllPostsCollection
    & AllCategoriesCollection
    & AllTagsCollection
>

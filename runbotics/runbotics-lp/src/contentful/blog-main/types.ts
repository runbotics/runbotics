import { BlogPost, Category, FetchContentfulResponse, Tag } from '#contentful/common';

import { getMainPage } from './api';

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
export type GetFilteredPostsOptions = {
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

export type BlogMainCache = Awaited<ReturnType<typeof getMainPage>> | null;

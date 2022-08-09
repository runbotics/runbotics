export interface SearchParams {
    page: number;
    pageSize: number;
    search?: string | null;
    searchField?: string | null;
}

export const getSearchParams = (params: SearchParams) => (params.search
    ? {
        search: (new URLSearchParams(
            {
                page: params.page.toString(),
                pageSize: params.pageSize.toString(),
                search: params.search,
                searchField: params.searchField,
            },
        )).toString(),
    }
    : {
        search: (new URLSearchParams(
            {
                page: params.page.toString(),
                pageSize: params.pageSize.toString(),
            },
        )).toString(),
    });

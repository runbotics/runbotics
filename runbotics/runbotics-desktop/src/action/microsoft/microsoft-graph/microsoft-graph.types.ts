import { ResponseType } from '@microsoft/microsoft-graph-client';

export interface RequestOptions {
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#expand-parameter
     */
    expand?: string | string[];
    /**
     * @see https://learn.microsoft.com/en-us/graph/filter-query-parameter?tabs=javascript
     */
    filter?: string;
    headers?: Record<string, string | number>;
    /**
     * @see
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: Record<string, any>;
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#orderby-parameter
     */
    orderBy?: string | string[];
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#search-parameter
     */
    search?: string;
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#search-parameter
     */
    select?: string | string[];
    query?: Record<string, string | number>;
    responseType?: ResponseType;
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#top-parameter
     */
    top?: number;
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#skip-parameter
     */
    skip?: number;
    /**
     * @see https://learn.microsoft.com/en-us/graph/query-parameters?tabs=javascript#count-parameter
     */
    count?: boolean;
}

export interface CollectionResponse<T> {
    '@odata.context': string;
    value: T[];
}

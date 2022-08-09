import { ObjectOf } from './objectOf';

export interface Page<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    sort: { sorted: boolean, unsorted: boolean, empty: boolean };
    totalElements: number;
    totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface PageRequestParams<T extends object = any> {
    page?: number;
    size?: number;
    sort?: SortType<T>;
    filter?: {
        contains?: ObjectOf<T>;
        equals?: ObjectOf<T>;
        in?: IdentifiersObjectOf<T>;
    };
}

type SortType<T> = {
    by: keyof T;
    order?: 'asc' | 'desc';
}

type IdentifiersObjectOf<T> = {
    [P in keyof T]: T[P] extends object | object[] ? PrimitiveParameterType : T[P];
}

type PrimitiveParameterType = string | string[] | number | number[];

import { OrderDirection } from 'runbotics-common';

import { ObjectOf } from './objectOf';

export interface Page<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface PageRequestParams<T extends object = any> {
    page?: number;
    size?: number;
    sort?: SortType<T>;
    filter?: {
        contains?: ObjectOf<T>;
        equals?: ObjectOf<T>;
        in?: IdentifiersObjectOf<T>;
    };
    [key: string]: unknown;
}

type SortType<T> = {
    by: keyof T;
    order?: OrderDirection;
}

type IdentifiersObjectOf<T> = {
    [P in keyof T]: T[P] extends object | object[] ? PrimitiveParameterType : T[P];
}

type PrimitiveParameterType = string | string[] | number | number[];

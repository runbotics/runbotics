import { Filter } from '#/utils/specification/filter/filter';

export type Criteria<T> = {
    [key in keyof T]: Filter;
}

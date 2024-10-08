import { Criteria } from '#/utils/specification/criteria/criteria';

export interface Specification<T extends Criteria> {
    criteria: T;
    order?: SpecificationOrder<T>;
}

export interface SpecificationOrder<T> {
    name: keyof T;
    direction: 'asc' | 'desc';
}


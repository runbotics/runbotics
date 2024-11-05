import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { Paging } from '#/utils/page/pageable.decorator';

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

export const getPage = async <T>(
    repo: Repository<T>,
    options: FindManyOptions<T>
): Promise<Page<T>> => {
    const [entities, count] = await repo.findAndCount(options);

    return toPage(entities, count, options.take, options.skip);
};

export const getQueryBuilderPage = async <T>(
    queryBuilder: SelectQueryBuilder<T>,
    paging: Paging
): Promise<Page<T>> => {
    const [entities, count] = await queryBuilder
        .skip(paging.skip ?? 0)
        .take(paging.take ?? 10)
        .getManyAndCount();

    return toPage(entities, count, paging.take ?? 10, paging.skip ?? 0);
};

const toPage = <T>(
    entities: T[],
    count: number,
    take: number,
    skip?: number
) => {
    const page = take ? Math.ceil(skip / take) : 0;
    const totalPages = take ? Math.ceil(count / take) : 1;

    return {
        content: entities,
        empty: entities.length === 0,
        first: !skip || skip === 0,
        totalElements: count,
        totalPages,
        last: totalPages === 0 || page === totalPages - 1,
        number: page,
        size: take,
        numberOfElements: entities.length,
    };
};

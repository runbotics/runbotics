import { FindManyOptions, Repository } from "typeorm";

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

export const getPage = async <T>(repo: Repository<T>, options: FindManyOptions<T>): Promise<Page<T>> => {
    const [entities, count] = await repo.findAndCount(options);

    const pageSize = options.take;
    const page = Math.ceil(options.skip / options.take);
    const totalPages = Math.ceil(count / pageSize);

    return {
        content: entities,
        empty: entities.length === 0,
        first: options.skip === 0,
        totalElements: count,
        totalPages,
        last: page === totalPages,
        number: page,
        size: pageSize,
        numberOfElements: entities.length,
    }
}

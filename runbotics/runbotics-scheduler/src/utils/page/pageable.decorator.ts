import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export type Paging = Pick<FindManyOptions, 'take' | 'skip'>;

export const Pageable = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const params = (request as Request).query;

        return getPaging(params);
    },
);

const getPaging = (params: Request['query']): Paging => {
    if (!params['size']) {
        return {};
    }

    if (params['size']) {
        const page = (() => {
            if (!params['page']) {
                return 0;
            } else if (typeof params['page'] !== 'string') {
                throw new BadRequestException();
            } else {
                const page = parseInt(params['page']);
                if (isFinite(page) && !isNaN(page)) {
                    return page;
                } else {
                    throw new BadRequestException();
                }
            }
        })();

        const pageSize = (() => {
            if (typeof params['size'] !== 'string') {
                throw new BadRequestException();
            }

            const size = parseInt(params['size']);
            if (isFinite(size) && !isNaN(size)) {
                return size;
            } else {
                throw new BadRequestException();
            }
        })();

        return {
            skip: pageSize * page,
            take: pageSize,
        };
    }
};

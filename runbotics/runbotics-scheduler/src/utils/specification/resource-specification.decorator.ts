import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Request } from 'express';
import { Equal, FindOptionsWhereProperty, ILike, ObjectLiteral, Or } from 'typeorm';
import { Specification } from '#/utils/specification/specification';
import { Criteria } from '#/utils/specification/criteria/criteria';
import { FilterType } from '#/utils/specification/filter-type';
import { Filter } from '#/utils/specification/filter/filter';

export interface CriteriaClass {
    new(): Criteria<CriteriaClass>;
}

export const ResourceSpecification = createParamDecorator<CriteriaClass>(
    (CriteriaClass: CriteriaClass, ctx: ExecutionContext): FindManyOptions => {
        const request = ctx.switchToHttp().getRequest();
        const params = (request as Request).query;
        const specification: Specification<Criteria<CriteriaClass>> = {
            criteria: new CriteriaClass(),
        };
        
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
                } else {
                    const size = parseInt(params['size']);
                    if (isFinite(size) && !isNaN(size)) {
                        return size;
                    } else {
                        throw new BadRequestException();
                    }
                }
            })()

            specification.pagination = {
                page,
                pageSize,
            };
        }

        Object.entries(params).forEach(([key, value]) => {
            console.log('xd', key, value);
            const [field, operator] = key.split('.');
            
            if(
                field &&
                specification.criteria[field] &&
                operator.length > 0 &&
                typeof value === 'string'
            ){
                specification.criteria[field].consume(operator, value);
            }
        });
        console.log('spec', specification)
        return specificationToFindOptions(specification);
    },
);

export const specificationToFindOptions = <T extends Criteria<T>>(
    specification: Specification<T>,
): FindManyOptions => {
    const where: FindManyOptions['where'] = {};

    Object.keys(specification.criteria).forEach((key) => {
        where[key] = specification.criteria[key].eval() as FindOptionsWhereProperty<Criteria<T>>;
    });

    const paging = specification.pagination ? {
        skip: specification.pagination.pageSize * specification.pagination.page,
        take: specification.pagination.pageSize,
    } : {};

    const order = specification.order ? {
        order: {
            [specification.order.name]: specification.order.direction,
        },
    } : {};

    return {
        ...paging,
        where,
        order,
    };
};


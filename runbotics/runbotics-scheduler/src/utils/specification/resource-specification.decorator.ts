import { BadRequestException, createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Request } from 'express';
import { FindOptionsWhereProperty } from 'typeorm';
import { Specification } from '#/utils/specification/specification';
import { Criteria } from '#/utils/specification/criteria/criteria';
import { Filter } from '#/utils/specification/filter/filter';

export interface CriteriaClass {
    new(): Criteria;
}

const logger = new Logger('ResourceSpecification');

export const ResourceSpecification = createParamDecorator<CriteriaClass>(
    (CriteriaClass: CriteriaClass, ctx: ExecutionContext): FindManyOptions => {

        const request = ctx.switchToHttp().getRequest();
        const params = (request as Request).query;
        const specification: Specification<Criteria> = {
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
            })();

            specification.pagination = {
                page,
                pageSize,
            };
        }

        Object.entries(params).forEach(([key, value]) => {
            const [field, operator] = key.split('.');

            if (
                field &&
                specification.criteria[field.split('->')[0]] &&
                operator.length > 0 &&
                typeof value === 'string'
            ) {
                const filterValue = getFilterRecursively(field, specification.criteria);
                filterValue.consume(operator, value);
            }
        });

        return specificationToFindOptions(specification);
    },
);

export const specificationToFindOptions = <T extends Criteria>(
    specification: Specification<T>,
): FindManyOptions => {
    const where: FindManyOptions['where'] = {};

    const getFilters = (criteria: Criteria) => {
        return Object.keys(criteria).filter(field => criteria[field].type === 'filter');
    };
    const getCriterias = (criteria: Criteria) => {
        return Object.keys(criteria).filter(field => criteria[field].type === 'criteria');
    };

    const evalRecursively = (criteria: Criteria, where: FindManyOptions['where']) => {
        getCriterias(criteria).forEach(field => {
            where[field] = {};
            evalRecursively(criteria[field] as Criteria, where[field]);
        });

        getFilters(criteria).forEach(field => {
            where[field] = criteria[field].eval() as FindOptionsWhereProperty<Criteria>;
        });
    };

    evalRecursively(specification.criteria, where);

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

const getFilterRecursively = (field: string, criteria: Criteria) => {
    const fields = field.split('->');

    let current: Criteria | Filter = criteria;

    for (let i = 0; i < fields.length; i++) {
        current = current[fields[i]];
    }
    
    if (current?._type !== 'filter') {
        logger.error(`Incorrect field: ${field}`);
        throw new BadRequestException(`Incorrect field: ${field}`);
    }

    return current;
};


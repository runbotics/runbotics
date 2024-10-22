import { BadRequestException, createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { FindManyOptions, FindOptionsOrder } from 'typeorm';
import { Request } from 'express';
import { FindOptionsWhere } from 'typeorm';
import { Specification } from '#/utils/specification/specification';
import { Criteria } from '#/utils/specification/criteria/criteria';
import { Filter } from '#/utils/specification/filter/filter';

export type Specs<T> = {
    where: FindOptionsWhere<T>,
    order: FindOptionsOrder<T>
};

export interface CriteriaClass {
    new(): Criteria;
}

const logger = new Logger('ResourceSpecification');

export const Specifiable = createParamDecorator<CriteriaClass>(
    (CriteriaClass: CriteriaClass, ctx: ExecutionContext): Specs<CriteriaClass> => {
        const request = ctx.switchToHttp().getRequest();
        const params = (request as Request).query;

        const specification: Specification<Criteria> = {
            criteria: new CriteriaClass(),
        };

        if (typeof params['sort'] === 'string') {
            const [field, order] = params['sort'].split(',');
            specification.order = {
                name: field as keyof Criteria,
                direction: order === 'asc' ? 'asc' : 'desc',
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
): {
    where: FindOptionsWhere<T>,
    order: FindOptionsOrder<T>,
} => {
    const where: FindOptionsWhere<T> = {};

    const getFilters = (criteria: Criteria) => {
        return Object.keys(criteria).filter(field => criteria[field]._type === 'filter');
    };
    const getCriteria = (criteria: Criteria) => {
        return Object.keys(criteria).filter(field => criteria[field]._type === 'criteria');
    };

    const evalRecursively = (criteria: Criteria, where: FindManyOptions['where']) => {

        let hasFilters = false;
        getCriteria(criteria).forEach(field => {
            where[field] = {};
            if (evalRecursively(criteria[field] as Criteria, where[field])) {
                hasFilters = true;
            } else {
                delete where[field];
            }
        });

        getFilters(criteria).forEach(field => {
            const evaluated = (criteria[field] as Filter).eval();
            if (evaluated) {
                where[field] = evaluated;
                hasFilters = true;
            }
        });

        return hasFilters;
    };

    evalRecursively(specification.criteria, where);

    const order: FindOptionsOrder<T> = (specification.order ?
        {
            [specification.order.name]: 'desc',
        } : {}) as FindOptionsOrder<T>;

    return {
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

import { BadRequestException, createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { FindManyOptions, FindOptionsOrder, FindOptionsOrderProperty } from 'typeorm';
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
            where[field] = criteria[field].eval() as FindOptionsWhere<Criteria>;
        });
    };

    evalRecursively(specification.criteria, where);

    // types in typeorm...
    const order: FindOptionsOrder<T> = (specification.order ?
        {
            [specification.order.name]: 'desc',
        } : {}) as { [P in keyof T]: P extends 'toString' ? unknown : FindOptionsOrderProperty<NonNullable<T[P]>> };

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

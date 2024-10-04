import { And, FindOneOptions, FindOperator, FindOptionsWhereProperty } from 'typeorm';
import { Criteria } from '#/utils/specification/criteria/criteria';

export abstract class Filter {
    abstract name: string;

    predicates: FindOperator<unknown>[] = [];
    
    eval(): FindOptionsWhereProperty<unknown> {
        return And(...this.predicates);
    }
    
    abstract consume(operator: string, value: string): void;
}

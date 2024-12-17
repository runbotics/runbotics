import { Or, FindOperator } from 'typeorm';

export abstract class Filter {
    _type = 'filter' as const;
    abstract name: string;

    predicates: FindOperator<unknown>[] = [];

    eval(): FindOperator<unknown> {
        return this.predicates.length > 0 ? Or(...this.predicates) : undefined;
    }

    abstract consume(operator: string, value: string): void;
}

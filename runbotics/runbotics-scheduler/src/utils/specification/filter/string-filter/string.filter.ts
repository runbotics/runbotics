import { Filter } from '#/utils/specification/filter/filter';
import { Equal, ILike, Not } from 'typeorm';


enum StringOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'notContains',
}

export class StringFilter extends Filter {
    name: 'string';

    equals(value: string) {
        this.predicates.push(Equal(value));
    }

    notEquals(value: string) {
        this.predicates.push(Not(Equal(value)));
    }

    contains(value: string) {
        this.predicates.push(ILike(`%${value}%`));
    }

    notContains(value: string) {
        this.predicates.push(Not(ILike(`%${value}%`)));
    }

    consume(operator: string, value: string) {
        if (!(Object.values(StringOperator) as string[]).includes(operator)) {
            throw Error(`${operator} is not an allowed boolean operator`);
        }

        switch (operator as StringOperator) {
            case StringOperator.EQUALS:
                this.equals(value);
                break;
            case StringOperator.NOT_EQUALS:
                this.notEquals(value);
                break;
            case StringOperator.CONTAINS:
                this.contains(value);
                break;
            case StringOperator.NOT_CONTAINS:
                this.notContains(value);
                break;
        }
    }
}

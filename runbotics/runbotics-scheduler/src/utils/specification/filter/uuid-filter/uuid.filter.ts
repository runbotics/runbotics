import { Filter } from '#/utils/specification/filter/filter';
import { Equal, Not } from 'typeorm';
import { validate as isValidUUID } from 'uuid';

enum UUIDOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
}

export class UUIDFilter extends Filter {
    name: 'uuid';

    equals(value: string) {
        this.predicates.push(Equal(value));
    }

    notEquals(value: string) {
        this.predicates.push(Not(Equal(value)));
    }

    consume(operator: string, value: string) {
        if (!(Object.values(UUIDOperator) as string[]).includes(operator)) {
            throw Error(`${operator} is not an allowed uuid operator`);
        }

        if (!isValidUUID(value)) {
            throw Error(`'${value}' is not a valid uuid`);
        }

        switch (operator as UUIDOperator) {
            case UUIDOperator.EQUALS:
                this.equals(value);
                break;
            case UUIDOperator.NOT_EQUALS:
                this.notEquals(value);
                break;
        }
    }
}

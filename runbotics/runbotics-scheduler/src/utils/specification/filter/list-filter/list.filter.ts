import { Filter } from '#/utils/specification/filter/filter';
import { Not, In } from 'typeorm';

enum ListOperator {
    IN = 'in',
    NOT_IN = 'notIn',
}

export class ListFilter extends Filter {
    name: 'list';

    in(value: string[]) {
        this.predicates.push(In(value));
    }

    notIn(value: string[]) {
        this.predicates.push(Not(In(value)));
    }

    consume(operator: string, value: string) {
        if (!(Object.values(ListOperator) as string[]).includes(operator)) {
            throw Error(`${operator} is not an allowed list operator`);
        }

        if (!this.isValidList(value)) {
            throw Error(`'${value}' is not a valid list`);
        }

        const list = value.split(',').filter((el) => el.length);

        switch (operator as ListOperator) {
            case ListOperator.IN:
                this.in(list);
                break;
            case ListOperator.NOT_IN:
                this.notIn(list);
                break;
        }
    }

    private isValidList(value: string) {
        return (
            typeof value === 'string' &&
            value.length > 0 &&
            value.split(',').filter((el) => el.length).length > 0
        );
    }
}

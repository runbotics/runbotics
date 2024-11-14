import { Equal, Not } from 'typeorm';
import { Filter } from '#/utils/specification/filter/filter';

const parseBoolean = (value: string) => {
    if (value.toLowerCase() === 'true') {
        return true;
    }

    if (value.toLowerCase() === 'false') {
        return false;
    }

    throw new Error(`String "${value}" can't be parsed to boolean`);
};

enum BooleanOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
}

export class BooleanFilter extends Filter {
    name: 'boolean';

    equals(value: boolean){
        this.predicates.push(Equal(value));
    }

    notEquals(value: boolean){
        this.predicates.push(Not(Equal(value)));
    }

    consume(operator: string, value: string) {
        if(!(Object.values(BooleanOperator) as string[]).includes(operator)){
            throw Error(`${operator} is not an allowed boolean operator`);
        }

        const parsed = parseBoolean(value);

        switch (operator as BooleanOperator){
            case BooleanOperator.EQUALS:
                this.equals(parsed);
                break;
            case BooleanOperator.NOT_EQUALS:
                this.notEquals(parsed);
                break;
        }
    }
}

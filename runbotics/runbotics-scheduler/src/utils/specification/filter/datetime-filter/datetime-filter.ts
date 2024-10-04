import { Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { Filter } from '#/utils/specification/filter/filter';

enum DatetimeOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    GREATER_THAN = 'greaterThan',
    GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
    LESS_THAN = 'lessThan',
    LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
}

export class DatetimeFilter extends Filter {
    name: 'datetime';

    equals(value: string){
        this.predicates.push(Equal(value));
    }

    notEquals(value: string){
        this.predicates.push(Not(Equal(value)));
    }

    greaterThan(value: string){
        this.predicates.push(MoreThan(value));
    }

    greaterThanOrEqual(value: string){
        this.predicates.push(MoreThanOrEqual(value));
    }

    lessThan(value: string){
        this.predicates.push(LessThan(value));
    }

    lessThanOrEqual(value: string){
        this.predicates.push(LessThanOrEqual(value));
    }
    
    consume(operator: string, value: string) {
        if(!(Object.values(DatetimeOperator) as string[]).includes(operator)){
            throw Error(`${operator} is not an allowed datetime operator`);
        }

        switch (operator as DatetimeOperator){
            case DatetimeOperator.EQUALS:
                this.equals(value);
                break;
            case DatetimeOperator.NOT_EQUALS:
                this.notEquals(value);
                break;
            case DatetimeOperator.GREATER_THAN:
                this.greaterThan(value);
                break;
            case DatetimeOperator.GREATER_THAN_OR_EQUAL:
                this.greaterThanOrEqual(value);
                break;
            case DatetimeOperator.LESS_THAN:
                this.lessThan(value);
                break;
            case DatetimeOperator.LESS_THAN_OR_EQUAL:
                this.lessThanOrEqual(value);
        }
    }
}

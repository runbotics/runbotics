import { Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { Filter } from '#/utils/specification/filter/filter';

enum NumberOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    GREATER_THAN = 'greaterThan',
    GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
    LESS_THAN = 'lessThan',
    LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
}

const parseNumber = (stringNumber: string) => {
    const number = Number(stringNumber);
    
    if(!isFinite(number) || isNaN(number)){
        throw Error(`Can't parse ${stringNumber} to number`);
    }
    
    return number;
}

export class NumberFilter extends Filter {
    name: 'number';

    equals(value: number){
        this.predicates.push(Equal(value));
    }

    notEquals(value: number){
        this.predicates.push(Not(Equal(value)));
    }

    greaterThan(value: number){
        this.predicates.push(MoreThan(value));
    }

    greaterThanOrEqual(value: number){
        this.predicates.push(MoreThanOrEqual(value));
    }

    lessThan(value: number){
        this.predicates.push(LessThan(value));
    }

    lessThanOrEqual(value: number){
        this.predicates.push(LessThanOrEqual(value));
    }

    consume(operator: string, value: string) {
        if(!(Object.values(NumberOperator) as string[]).includes(operator)){
            throw Error(`${operator} is not an allowed datetime operator`);
        }
        
        const parsed = parseNumber(value);

        switch (operator as NumberOperator){
            case NumberOperator.EQUALS:
                this.equals(parsed);
                break;
            case NumberOperator.NOT_EQUALS:
                this.notEquals(parsed);
                break;
            case NumberOperator.GREATER_THAN:
                this.greaterThan(parsed);
                break;
            case NumberOperator.GREATER_THAN_OR_EQUAL:
                this.greaterThanOrEqual(parsed);
                break;
            case NumberOperator.LESS_THAN:
                this.lessThan(parsed);
                break;
            case NumberOperator.LESS_THAN_OR_EQUAL:
                this.lessThanOrEqual(parsed);
        }
    }
}


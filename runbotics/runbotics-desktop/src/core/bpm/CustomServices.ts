import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import merge from 'lodash/merge';
import isNaN from 'lodash/isNaN';
import _ from 'lodash';
import moment from 'moment';

export const customServices: Record<string, Function> = {
    // @ts-ignore
    _: _,
    slice: (value: string, start: number, end: number) => {
        return value.slice(start, end);
    },
    merge: (obj1: any, obj2: any) => {
        return merge(obj1, obj2);
    },
    negation: (arg1) => {
        return !arg1;
    },
    decrement: (arg1: any) => {
        return arg1 - 1;
    },
    increment: (arg1: any) => {
        return ++arg1;
    },
    getLength: (arg1: any) => {
        return arg1.length;
    },
    getLastElemIdx: (arg1: any) => {
        return arg1.length - 1;
    },
    jsonAsString: (arg1: any) => {
        return JSON.stringify(arg1);
    },
    isEmptyString: (str: string) => {
        return !str || 0 === str.length || /^\s*$/.test(str);
    },
    isEqual: (arg1: any, arg2: any) => {
        return isEqual(arg1, arg2);
    },
    isNotEqual: (arg1: any, arg2: any) => {
        return arg1 != arg2;
    },
    isBlank: (value: any) => {
        return (isEmpty(value) && !isNumber(value)) || isNaN(value);
    },
    push: (array: any[], newElement: any) => {
        if (!array) {
            return [newElement];
        }
        return array.concat([newElement]);
    },
    concat: (arg1: any, arg2: any) => {
        const array1 = arg1 ? arg1 : [];
        const array2 = arg2 ? arg2 : [];

        return [...array1, ...array2];
    },
    split: (arg1: string, splitter: string) => {
        return arg1.split(splitter);
    },
    splitAndPick: (arg1: string, splitter: string, pick: number) => {
        return arg1.split(splitter)[pick];
    },
    parseJson: (json: any) => {
        return JSON.parse(json);
    },
    getCurrentDate: () => {
        return moment().format('YYYY-MM-DD');
    },
    getPreviousWorkday: () => {
        const workday = moment();
        const day = workday.day();
        let diff = 1; // returns yesterday
        if (day == 0 || day == 1) {
            // is Sunday or Monday
            diff = day + 2; // returns Friday
        }
        return workday.subtract(diff, 'days').format('YYYY-MM-DD');
    },
    getFirstWorkingDayOfCurrentMonth: (format?: string) => {
        return customServices.getFirstWorkingDayOfFutureMonth(0, format);
    },
    getFirstWorkingDayOfFutureMonth: (monthNumber: number, format?: string) => {
        let firstDate = moment().add(monthNumber, 'month').startOf('month');

        while (firstDate.day() % 6 == 0) {
            firstDate = firstDate.add(1, 'day');
        }
        return format ? firstDate.format(format) : firstDate;
    },
    getLastWorkingDayOfCurrentMonth: (format?: string) => {
        return customServices.getLastWorkingDayOfFutureMonth(0, format);
    },
    getLastWorkingDayOfFutureMonth: (monthNumber: number, format?: string) => {
        let firstDate = moment().add(monthNumber, 'month').endOf('month');

        while (firstDate.day() % 6 == 0) {
            firstDate = firstDate.subtract(1, 'day');
        }
        return format ? firstDate.format(format) : firstDate;
    },
    objFromArray: (arr: any[], key = 'id') => {
        return arr.reduce((accumulator, current) => {
            accumulator[current[key]] = current;
            return accumulator;
        }, {});
    },
    readEnv: async (key: string) => {
        if (process.env[key]) {
            return process.env[key];
        }
        throw new Error('Environment variable not found');
    },
    jsonToPrettyHTML: (object: Record<string, any>) => {
        return Object.entries(object)
            .map(([key, value]) => {
                return key + ': ' + value;
            })
            .reduce((previousValue, currentValue) => {
                return previousValue + currentValue + '<br/>';
            }, '');
    },
    roundAll: (object: Record<string, any>) => {
        const newObject: Record<string, any> = {};
        for (const [key, value] of Object.entries(object)) {
            if (value == null) {
                newObject[key] = value;
            } else if (isNaN(value)) {
                newObject[key] = value;
            } else {
                newObject[key] = Math.round(Number(value) * 100) / 100;
            }
        }
        return newObject;
    },
};

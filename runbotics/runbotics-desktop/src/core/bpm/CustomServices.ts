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
    //identity
    idt: (a: any) => a,
    moment: (args: any[]) => moment(...args),
    slice: (value: string, start: number, end: number) => {
        return value.slice(start, end);
    },
    merge: (obj1: any, obj2: any) => {
        return merge(obj1, obj2);
    },
    decrement: (arg1: any) => {
        return arg1 - 1;
    },
    increment: (arg1: any) => {
        return ++arg1;
    },
    get: (arg1: any, arg2: any) => {
        return arg1[arg2];
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
    // get(executionContext: any, callback: any) {
    //     console.log("executed!!!")
    //     debugger;
    //     callback();
    // },
    objectAsBoolean: (obj: any) => {
        return obj ? true : false;
    },

    stringObjectAsBoolean: (obj: any) => {
        const t = typeof obj;
        return (t === 'string' && 'true'.localeCompare(obj) === 0) || (t !== 'string' && obj) ? true : false;
    },

    orObjectsAsBoolean: (obj1: any, obj2: any) => {
        console.log('orObjectAsBoolean', obj1, obj2, 'BPM-service-call');
        return customServices.stringObjectAsBoolean(obj1) || customServices.stringObjectAsBoolean(obj2);
    },
    andObjectsAsBoolean: (obj1: any, obj2: any) => {
        console.log('andObjectAsBoolean', obj1, obj2, 'BPM-service-call');
        return customServices.stringObjectAsBoolean(obj1) && customServices.stringObjectAsBoolean(obj2);
    },
    isEmptyString: (str: any) => {
        //console.log('checking empty string: '+str);
        return !str || 0 === str.length || /^\s*$/.test(str);
    },
    isEqualStr: (arg: any, next: any, any: any) => {
        return ('' + next).localeCompare('' + arg) === 0;
    },
    isEqual: (arg1: any, arg2: any) => {
        console.log('isEqual called:', arg1, arg2, 'BPM-service-call');
        let result = isEqual(arg1, arg2);

        console.log('isEqual result:', result, 'BPM-service-call');
        return result;
    },
    isNotEqual: (arg1: any, arg2: any) => {
        console.log('Script', 'isNotEqqqual', arg1, arg2);
        // debugger;
        return arg1 != arg2;
    },
    incrementAndCompare: (arg1: any, arg2: any, isEqual: boolean) => {
        console.log('Script', 'incrementAndCompare', arg1, arg2, isEqual);
        let incremented = Number(arg1) + 1;
        if (isEqual) {
            let result = incremented == arg2;
            return result;
        } else {
            let result = incremented != arg2;
            return result;
        }
    },
    isBlank: (value: any) => {
        return (isEmpty(value) && !isNumber(value)) || isNaN(value);
    },
    push: (arg1: any, arg2: any) => {
        if (!arg1) {
            return [arg2];
        }
        return arg1.concat([arg2]);
    },
    concat: (arg1: any, arg2: any) => {
        const array1 = arg1 ? arg1 : [];
        const array2 = arg2 ? arg2 : [];

        return [...array1, ...array2];
    },
    splitAndPick: (arg1: any, pick: any) => {
        console.log('executing splitAndPic', arg1, pick, 'BPM-service-call');
        return arg1.split('-')[pick];
    },
    parseJson: (json: any) => {
        console.info('parse json', json, 'BPM-service-call');
        const res = JSON.parse(json);
        console.info('parse json result', res, 'BPM-service-call');
        return res;
    },

    csvToObject: (cfg: any) => {
        console.info('csvToObject - config', cfg, 'BPM-service-call');
        const headers: string[] = cfg.csvHeader.split(',');
        const content: string[] = cfg.csvContent.split(',');

        const res = [];
        let colIdx;
        let row: any;
        for (let idx = 0; idx < content.length; idx++) {
            colIdx = idx % headers.length;

            if (colIdx === 0) {
                row = {};
                res.push(row);
            }

            row[headers[colIdx]] = content[idx];
        }
        console.info('csvToObject - result', res, 'BPM-service-call');
        return res;
    },

    comaSeparatedToArray: (s: any) => {
        return s.split(',');
    },
    withDefault: (def: any, val: any) => {
        //console.log("with default:", def, val);
        return val !== undefined && val !== null && val !== '' ? val : def;
    },
    getCurrentDate: (format: any) => {
        return moment().format('YYYY-MM-DD');
    },

    getPreviousWorkday() {
        let workday = moment();
        let day = workday.day();
        let diff = 1; // returns yesterday
        if (day == 0 || day == 1) {
            // is Sunday or Monday
            diff = day + 2; // returns Friday
        }
        return workday.subtract(diff, 'days').format('YYYY-MM-DD');
    },

    checkCurrentTimeBefore: (time: any) => {
        console.log('check current time before: ' + time, 'BPM-service-call');

        const format = 'HH:mm:ss';

        const currTime = moment();
        const checkTime = moment(time, format);

        const res = currTime.isBefore(checkTime);

        console.log('checkTime: ' + checkTime, 'BPM-service-call');
        console.log('currTime: ' + currTime, 'BPM-service-call');
        console.log('result is: ' + res, 'BPM-service-call');

        return res;
    },
    checkCurrentTimeAfter: (time: any) => {
        const format = 'HH:mm:ss';

        const currTime = moment();
        const checkTime = moment(time, format);

        const res = currTime.isAfter(checkTime);

        console.log('check current time after: ' + time, 'BPM-service-call');
        console.log('checkTime: ' + checkTime, 'BPM-service-call');
        console.log('currTime: ' + currTime, 'BPM-service-call');
        console.log('result is: ' + res, 'BPM-service-call');

        return res;
    },
    checkCurrentTimeBetween: (startTime: any, endTime: any) => {
        const format = 'HH:mm:ss';

        const currTime = moment();
        const startCheckTime = moment(startTime, format);
        const endCheckTime = moment(endTime, format);

        console.log('checking current time between: ' + startTime + ' and ' + endTime, 'BPM-service-call');
        console.log('current time is: ' + currTime, 'BPM-service-call');
        console.log('startCheckTime is: ' + startCheckTime, 'BPM-service-call');
        console.log('endCheckTime is: ' + endCheckTime, 'BPM-service-call');

        const res = currTime.isBetween(startCheckTime, endCheckTime);
        console.log('result is: ' + res, 'BPM-service-call');

        return res;
    },
    getSecondsToNextDayTime: (daysNumber: any, nextDayTime: any) => {
        const format = 'HH:mm:ss';
        const nextDay = moment(nextDayTime, format).add(daysNumber, 'day');

        const res = nextDay.diff(moment());

        //console.log("calculation seconds to next day time: days="+daysNumber+" time="+nextDayTime);
        //console.log('next day is: '+nextDay);
        //console.log('current day is: '+moment());
        //console.log('result is: '+res);

        return res;
    },

    getSecondsToSpecifiedHour: (hour: any) => {
        const format = 'HH:mm:ss';
        var specHour = moment(hour, format);
        const now = moment();

        if (now.isBefore(specHour)) {
            return specHour.diff(now);
        } else {
            return specHour.add(1, 'day').diff(now);
        }
    },

    getFirstWorkingDayOfCurrentMonth: (format?: string) => {
        return customServices.getFirstWorkingDayOfFutureMonth(0, format);
    },

    getFirstWorkingDayOfFutureMonth: (monthsNumber: any, format?: string) => {
        var firstdate = moment().add(monthsNumber, 'month').startOf('month');

        while (firstdate.day() % 6 == 0) {
            firstdate = firstdate.add(1, 'day');
        }

        console.log('oryginal first working day: ' + firstdate.format('DD-MM-YYYY'), 'BPM-service-call');
        //for testing purpouse
        //firstdate = firstdate.add(17, 'days');
        //console.log('modified first working day: '+firstdate.format("DD-MM-YYYY"));

        return format ? firstdate.format(format) : firstdate;
    },

    getLastWorkingDayOfCurrentMonth: (format?: string) => {
        return customServices.getLastWorkingDayOfFutureMonth(0, format);
    },

    getLastWorkingDayOfFutureMonth: (monthsNumber: any, format?: string) => {
        var firstdate = moment().add(monthsNumber, 'month').endOf('month');

        while (firstdate.day() % 6 == 0) {
            firstdate = firstdate.subtract(1, 'day');
        }

        //for testing purpouse
        //firstdate = firstdate.subtract(11, 'days');
        //console.log('modified last working day: '+firstdate.format("DD-MM-YYYY"));

        return format ? firstdate.format(format) : firstdate;
    },

    checkFirstWorkingDayOfCurrentMonth: () => {
        const firstdate: any = customServices.getFirstWorkingDayOfCurrentMonth();
        return firstdate.isSame(moment(), 'day');
    },

    checkLastWorkingDayOfCurrentMonth: () => {
        const firstdate: any = customServices.getLastWorkingDayOfCurrentMonth();
        return firstdate.isSame(moment(), 'day');
    },

    getSecondsToFirstWorkingDayOfMonth: (hour: string) => {
        var month = 0;
        do {
            var firstWorkingDayOfMonth: any = customServices.getFirstWorkingDayOfFutureMonth(month);

            if (hour) {
                firstWorkingDayOfMonth.set('hour', +hour);
                //Only for testing
                firstWorkingDayOfMonth.set('minute', 58);
            }

            if (moment().isBefore(firstWorkingDayOfMonth)) {
                return firstWorkingDayOfMonth.diff(moment());
            }
            month++;
        } while (true);
    },

    transformArraysToArray: (input: Record<string, { value: any }[]>) => {
        let i = 0;
        let elements: Record<string, any> = {};
        Object.entries(input).map(([key, rows]) => {
            i = 0;
            rows.forEach((row, index) => {
                if (!elements[index]) {
                    elements[index] = {};
                }
                elements[index][key] = row['value'];
            });
        });

        return Object.values(elements);
    },

    getCurrentShortMonthYear: () => {
        return moment().format('MMM-YY');
    },

    // needs to be eimplemented
    compareMaps: (array1: Record<string, Record<string, any>>, array2: Record<string, Record<string, any>>) => {
        let same = true;
        Object.entries(array1).forEach(([key, object]) => {
            if (array2[key] == null) {
                same = false;
                return;
            }
            let object2 = array2[key];

            Object.entries(object).forEach(([fieldKey, fieldValue]) => {
                if (fieldValue == object2[fieldKey]) {
                } else {
                    same = false;
                    return;
                }
            });

            if (!same) {
                return;
            }
        });

        return same;
    },

    diffMaps: (
        array1: Record<string, Record<string, any>>,
        field1: string,
        array2: Record<string, Record<string, any>>,
        field2: string,
    ) => {
        let differ: Record<string, number> = {};
        Object.entries(array1).forEach(([key, object]) => {
            let value1 = object[field1];
            let value2 = array2[key][field2];

            differ[key] = Number(value2.replace(/,/g, '.')) - Number(value1.replace(/,/g, '.'));
        });

        return differ;
    },

    objFromArray: (arr: any[], key: string = 'id') => {
        return arr.reduce((accumulator, current) => {
            accumulator[current[key]] = current;
            return accumulator;
        }, {});
    },
    readFromStorage: async (kejsonToPrettyStringListy: string) => {
        throw new Error('Not implemented yet');
        // const result = await browser.storage.local.get(key);
        // return result[key];
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
    test: (arg: any) => {
        return 'zxss123s2s';
    },
    roundAll: (arg: Record<string, any>, precision?: string | number) => {
        let prec = precision ? Number(precision) : 2;
        let newObject: Record<string, any> = {};
        for (let [key, value] of Object.entries(arg)) {
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

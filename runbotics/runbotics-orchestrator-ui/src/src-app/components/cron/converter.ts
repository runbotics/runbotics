/* eslint-disable complexity */
/* eslint-disable max-params */
import { MutableRefObject } from 'react';

import { UNITS, SUPPORTED_SHORTCUTS } from './constants';
import {
    Unit,
    PeriodType,
    LeadingZero,
    ClockFormat,
    SetInternalError,
    OnError,
    AllowEmpty,
    Locale,
    Shortcuts,
    SetValuePeriod,
    cronObjProps,
    CRON_ACTIONS,
    CronStateProps,
} from './types';
import {
    range, sort, dedup, setError, checkIsShortcutsArray,
} from './utils';

/**
 * Set values from cron string
*/

export function setValuesFromCronString(
    cronString: string,
    setInternalError: SetInternalError,
    onError: OnError,
    allowEmpty: AllowEmpty,
    internalValueRef: MutableRefObject<string>,
    firstRender: boolean,
    locale: Locale,
    shortcuts: Shortcuts,
    setPeriod: SetValuePeriod,
    cronDispatch: React.Dispatch<any>,
) {
    onError && onError(undefined);
    setInternalError(false);

    let error = false;
    let newCronString = cronString;

    // Handle empty cron string
    if (!newCronString) {
        if (allowEmpty === 'always' || (firstRender && allowEmpty === 'for-default-value'))
        { return; }


        error = true;
    }

    if (!error) {
        // Shortcuts management
        if (
            shortcuts &&
            (shortcuts === true || (checkIsShortcutsArray(shortcuts) && shortcuts.includes(newCronString)))
        ) {
            if (newCronString === '@reboot') {
                setPeriod(PeriodType.REBOOT);

                return;
            }

            // Convert a shortcut to a valid cron string
            const shortcutObject = SUPPORTED_SHORTCUTS.find(
                (supportedShortcut) => supportedShortcut.name === newCronString
            );

            if (shortcutObject) {
                newCronString = shortcutObject.value;
            }
        }

        try {
            const cronParts = parseCronString(newCronString);
            const period = getPeriodFromCronparts(cronParts);

            setPeriod(period);

            cronDispatch({ 
                type: CRON_ACTIONS.SET_EACH, 
                payload: { 
                    newState: {
                        minutes: cronParts[0],
                        hours: cronParts[1],
                        monthDays: cronParts[2],
                        months: cronParts[3],
                        weekDays: cronParts[4],
                        nthWeekDays: [],
                        nthMonthDays: [],
                    } 
                } 
            });

        } catch (err) {
            // Specific errors are not handle (yet)
            error = true;
        }
    }

    if (error) {
        const newInternalValueRef = internalValueRef;
        newInternalValueRef.current = newCronString;
        setInternalError(true);
        setError(onError, locale);
    }
}

/**
 * Get cron string from values
 */
export function getCronStringFromValues(
    period: PeriodType,
    cronState: CronStateProps,
    humanizeValue?: boolean,
) {
    if (period === 'reboot')
    { return '@reboot'; }

    const newMonths = period === PeriodType.YEAR && cronState?.months ? cronState.months : [];
    const newMonthDays = (period === PeriodType.YEAR || period === PeriodType.MONTH) && cronState?.monthDays ? cronState.monthDays : [];
    const newNthMonthDays = (period === PeriodType.YEAR || period === PeriodType.MONTH) && cronState?.nthMonthDays ? cronState.nthMonthDays : [];
    const newWeekDays = (period === PeriodType.YEAR || period === PeriodType.MONTH || period === PeriodType.WEEK) && cronState?.weekDays ? cronState.weekDays : [];
    const newNthWeekDays = (period === PeriodType.YEAR || period === PeriodType.MONTH) && cronState?.nthWeekDays ? cronState.nthWeekDays : [];
    const newHours = period !== PeriodType.MINUTE && period !== PeriodType.HOUR && cronState?.hours ? cronState.hours : [];
    const newMinutes = period !== PeriodType.MINUTE && cronState?.minutes ? cronState.minutes : [];

    const parsedArray = parseCronArray({ 
        newMinutes, 
        newHours, 
        newMonthDays,
        newMonths, 
        newWeekDays, 
        newNthWeekDays,
        newNthMonthDays,
    }, humanizeValue);

    return cronToString(parsedArray);
}

/**
 * Returns the cron part array as a string.
 */
export function partToString(
    cronPart: number[],
    unit: Unit,
    humanize?: boolean,
    leadingZero?: LeadingZero,
    clockFormat?: ClockFormat,
) {
    let retval = '';

    if (isFull(cronPart, unit) || cronPart.length === 0) {
        retval = '*';
    } else {
        const step = getStep(cronPart);

        if (step && isInterval(cronPart, step)) {
            if (isFullInterval(cronPart, unit, step)) {
                retval = `*/${step}`;
            } else {
                retval = `${formatValue(
                    getMin(cronPart),
                    unit,
                    humanize,
                    leadingZero,
                    clockFormat
                )}-${formatValue(
                    getMax(cronPart),
                    unit,
                    humanize,
                    leadingZero,
                    clockFormat
                )}/${step}`;
            }
        } else {
            retval = toRanges(cronPart)
                .map((rangeValue: number | number[]) => {
                    if (Array.isArray(rangeValue)) {
                        return `${formatValue(
                            rangeValue[0],
                            unit,
                            humanize,
                            leadingZero,
                            clockFormat
                        )}-${formatValue(
                            rangeValue[1],
                            unit,
                            humanize,
                            leadingZero,
                            clockFormat
                        )}`;
                    }

                    return formatValue(
                        rangeValue,
                        unit,
                        humanize,
                        leadingZero,
                        clockFormat
                    );
                })
                .join(',');
        }
    }

    return retval;
}

/**
 * Format the value
 */
export function formatValue(
    value: number,
    unit: Unit,
    humanize?: boolean,
    leadingZero?: LeadingZero,
    clockFormat?: ClockFormat,
) {
    let cronPartString = value.toString();
    const { type, alt, min } = unit;
    const needLeadingZero = leadingZero && (leadingZero === true || leadingZero.includes(type as any));
    const need24HourClock = clockFormat === '24-hour-clock' && (type === 'hours' || type === 'minutes');

    if (humanize && (type === 'week-days' || type === 'months' || type === 'nth-week-days'))
    { cronPartString = alt[value - min]; }
    else if (value < 10 && (needLeadingZero || need24HourClock))
    { cronPartString = cronPartString.padStart(2, '0'); }


    if (type === 'hours' && clockFormat === '12-hour-clock') {
        const suffix = value >= 12 ? 'PM' : 'AM';
        let hour: number | string = value % 12 || 12;

        if (hour < 10 && needLeadingZero) {
            hour = hour.toString().padStart(2, '0');
        }

        cronPartString = `${hour}${suffix}`;
    }

    return cronPartString;
}

/**
 * Parses a object of arrays of integers as a cron schedule
 */

function parseCronArray(cronObj: cronObjProps, humanizeValue?: boolean) {
    if (Object.keys(cronObj).length !== 7) throw new Error('Invalid cron array');

    const resultArr = [];

    Object.entries(cronObj).forEach(([, partArr], idx) => {
        const unit = UNITS[idx];
        const parsedArray = parsePartArray(partArr, unit);
        let newPart = partToString(parsedArray, unit, humanizeValue);

        switch (unit.type) {
            case 'nth-week-days':
                if(resultArr[4] !== '*' && newPart !== '*') {
                    newPart = Number(newPart) === 4 ? 'L' : `#${Number(newPart)+1}`;
                    resultArr[4] += newPart;
                };

                break;
            case 'nth-month-days':
                if (Number(newPart) === 0) {
                    newPart = 'L';
                } else if (Number(newPart) === 1) {
                    newPart = 'LW';
                }

                if(resultArr[2] === '*') {
                    resultArr[2] = newPart;
                }

                break;
            default:
                resultArr.push(newPart);
        }
    });

    return resultArr;
}

/**
 * Returns the cron array as a string
 */
function cronToString(parts: string[]) {
    return parts.join(' ');
}

/**
 * Find the period from cron parts
 */
function getPeriodFromCronparts(cronParts: number[][]): PeriodType {
    if (cronParts[3].length > 0) {
        return PeriodType.YEAR;
    }
    if (cronParts[2].length > 0) {
        return PeriodType.MONTH;
    }
    if (cronParts[4].length > 0) {
        return PeriodType.WEEK;
    }
    if (cronParts[1].length > 0) {
        return PeriodType.DAY;
    }
    if (cronParts[0].length > 0) {
        return PeriodType.HOUR;
    }

    return PeriodType.MINUTE;
}

/**
 * Parses a cron string to an array of parts
 */
function parseCronString(str: string) {
    if (typeof str !== 'string')
    { throw new Error('Invalid cron string'); }


    const parts = str.replace(/\s+/g, ' ').trim().split(' ');

    if (parts.length === 5)
    { return parts.map((partStr, idx) => parsePartString(partStr, UNITS[idx])); }


    throw new Error('Invalid cron string format');
}

/**
 * Parses a string as a range of positive integers
 */
function parsePartString(str: string, unit: Unit) {
    if (str === '*' || str === '*/1')
    { return []; }


    const stringParts = str.split('/');

    if (stringParts.length > 2)
    { throw new Error(`Invalid value '${unit.type}'`); }


    const rangeString = replaceAlternatives(stringParts[0], unit.min, unit.alt);
    let parsedValues: number[];

    if (rangeString === '*') {
        parsedValues = range(unit.min, unit.max);
    } else {
        parsedValues = sort(
            dedup(
                fixSunday(
                    rangeString
                        .split(',')
                        .map((rangeValue) => parseRange(rangeValue, str, unit))
                        .flat(),
                    unit,
                ),
            ),
        );

        const value = outOfRange(parsedValues, unit);

        if (typeof value !== 'undefined')
        { throw new Error(`Value '${value}' out of range for ${unit.type}`); }

    }

    const step = parseStep(stringParts[1], unit);
    const intervalValues = applyInterval(parsedValues, step);

    if (intervalValues.length === unit.total)
    { return []; }
    if (intervalValues.length === 0)
    { throw new Error(`Empty interval value '${str}' for ${unit.type}`); }


    return intervalValues;
}

/**
 * Replaces the alternative representations of numbers in a string
 */
function replaceAlternatives(str: string, min: number, alt?: string[]) {
    let newStr = str;
    if (alt) {
        newStr = newStr.toUpperCase();

        for (let i = 0; i < alt.length; i += 1)
        { newStr = newStr.replace(alt[i], `${i + min}`); }

    }
    return newStr;
}

/**
 * Replace all 7 with 0 as Sunday can be represented by both
 */
function fixSunday(values: number[], unit: Unit) {
    let newValues = values;
    if (unit.type === 'week-days')
    { newValues = newValues.map((value) => {
        if (value === 7)
        { return 0; }


        return value;
    }); }


    return newValues;
}

/**
 * Parses a range string
 */
function parseRange(rangeStr: string, context: string, unit: Unit) {
    const subparts = rangeStr.split('-');

    if (subparts.length === 1) {
        const value = parseInt(subparts[0], 10);

        if (Number.isNaN(value)) {
            throw new Error(`Invalid value '${context}' for ${unit.type}`);
        }

        return [value];
    }
    if (subparts.length === 2) {
        const minValue = parseInt(subparts[0], 10);
        const maxValue = parseInt(subparts[1], 10);

        if (maxValue <= minValue) {
            throw new Error(
                `Max range is less than min range in '${rangeStr}' for ${unit.type}`
            );
        }

        return range(minValue, maxValue);
    }
    throw new Error(`Invalid value '${rangeStr}' for ${unit.type}`);
}

/**
 * Finds an element from values that is outside of the range of unit
 */
function outOfRange(values: number[], unit: Unit) {
    const first = values[0];
    const last = values[values.length - 1];

    if (first < unit.min) {
        return first;
    }
    if (last > unit.max) {
        return last;
    }

    return undefined;
}

/**
 * Parses the step from a part string
 */
function parseStep(step: string, unit: Unit) {
    if (typeof step !== 'undefined') {
        const parsedStep = parseInt(step, 10);

        if (Number.isNaN(parsedStep) || parsedStep < 1)
        { throw new Error(`Invalid interval step value '${step}' for ${unit.type}`); }


        return parsedStep;
    }
    return undefined;
}

/**
 * Applies an interval step to a collection of values
 */
function applyInterval(values: number[], step?: number) {
    let newValues = values;
    if (step) {
        const minVal = newValues[0];

        newValues = newValues.filter((value) => value % step === minVal % step || value === minVal);
    }

    return newValues;
}

/**
 * Validates a range of positive integers
 */
export function parsePartArray(arr: number[], unit: Unit) {
    const values = sort(dedup(fixSunday(arr, unit)));

    if (values.length === 0)
    { 
        return values; 
    }


    const value = outOfRange(values, unit);

    if (typeof value !== 'undefined')
    { 
        throw new Error(`Value '${value}' out of range for ${unit.type}`); 
    }


    return values;
}

/**
 * Returns true if range has all the values of the unit
 */
function isFull(values: number[], unit: Unit) {
    return values.length === unit.max - unit.min + 1;
}

/**
 * Returns the difference between first and second elements in the range
 */
function getStep(values: number[]) {
    if (values.length > 2) {
        const step = values[1] - values[0];

        if (step > 1)
        { 
            return step; 
        }
    }

    return 0;
}

/**
 * Returns true if the range can be represented as an interval
 */
function isInterval(values: number[], step: number) {
    for (let i = 1; i < values.length; i += 1) {
        const prev = values[i - 1];
        const value = values[i];

        if (value - prev !== step)
        { 
            return false; 
        }
    }

    return true;
}

/**
 * Returns true if the range contains all the interval values
 */
function isFullInterval(values: number[], unit: Unit, step: number) {
    const min = getMin(values);
    const max = getMax(values);
    const haveAllValues = values.length === (max - min) / step + 1;

    if (min === unit.min && max + step > unit.max && haveAllValues)
    { return true; }


    return false;
}

/**
 * Returns the smallest value in the range
 */
function getMin(values: number[]) {
    return values[0];
}

/**
 * Returns the largest value in the range
 */
function getMax(values: number[]) {
    return values[values.length - 1];
}

/**
 * Returns the range as an array of ranges
 * defined as arrays of positive integers
 */
function toRanges(values: number[]) {
    const retval: (number[] | number)[] = [];
    let startPart: number | null = null;

    values.forEach((value, index, self) => {
        if (value !== self[index + 1] - 1) {
            if (startPart !== null) {
                retval.push([startPart, value]);
                startPart = null;
            } else {
                retval.push(value);
            }
        } else if (startPart === null) {
            startPart = value;
        }
    });

    return retval;
}

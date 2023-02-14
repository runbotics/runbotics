import { ShortcutsValues, Unit } from './types';

export const SUPPORTED_SHORTCUTS: ShortcutsValues[] = [
    {
        name: '@yearly',
        value: '0 0 1 1 *',
    },
    {
        name: '@annually',
        value: '0 0 1 1 *',
    },
    {
        name: '@monthly',
        value: '0 0 1 * *',
    },
    {
        name: '@weekly',
        value: '0 0 * * 0',
    },
    {
        name: '@daily',
        value: '0 0 * * *',
    },
    {
        name: '@midnight',
        value: '0 0 * * *',
    },
    {
        name: '@hourly',
        value: '0 * * * *',
    },
];
// The order of elements below is crucial, do not shuffle it
// In addition, "alt" values are used only internally for Cron syntax. Each change has direct impact on the displayed info.
// You can find translations in ./locale.ts.
export const UNITS: Unit[] = [
    {
        type: 'minutes',
        min: 0,
        max: 59,
        total: 60,
    },
    {
        type: 'hours',
        min: 0,
        max: 23,
        total: 24,
    },
    {
        type: 'month-days',
        min: 1,
        max: 31,
        total: 31,
    },
    {
        type: 'nth-month-days',
        min: 0,
        max: 1,
        total: 2,
        alt: ['last', 'last-weekday']
    },
    {
        type: 'months',
        min: 1,
        max: 12,
        total: 12,
        alt: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    },
    {
        type: 'week-days',
        min: 0,
        max: 6,
        total: 7,
        alt: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    },
    {
        type: 'nth-week-days',
        min: 0,
        max: 4,
        total: 5,
        alt: ['1st', '2nd', '3rd', '4th', 'last'],
    },
];

export enum UnitIndex {
    MINUTES,
    HOURS,
    MONTH_DAYS,
    NTH_MONTH_DAYS,
    MONTHS,
    WEEK_DAYS,
    NTH_WEEK_DAYS,
}

export enum CronOrder {
    MINUTES,
    HOURS,
    MONTH_DAYS,
    MONTHS,
    WEEK_DAYS,
}

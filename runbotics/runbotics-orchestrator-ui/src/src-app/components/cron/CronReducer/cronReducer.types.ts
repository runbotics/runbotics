export interface CronStateProps {
    minutes: number[];
    hours: number[];
    monthDays: number[];
    nthMonthDays: number[];
    months: number[];
    weekDays: number[];
    nthWeekDays: number[];
}

export interface CronActionProps {
    type: CronActions,
    payload?: {
        newValue?: number[],
        newState?: CronStateProps,
    }
}

export enum CronActions {
    CLEAR_ALL = 'clear-all',
    SET_ALL = 'set-all',
    SET_EACH = 'set-each',
    SET_MONTHS = 'set-months',
    SET_MONTH_DAYS = 'set-month-days',
    SET_NTH_MONTH_DAYS = 'set-nth-month-days',
    SET_WEEK_DAYS = 'set-week-days',
    SET_NTH_WEEK_DAYS = 'set-nth-week-days',
    SET_HOURS = 'set-hours',
    SET_MINUTES = 'set-minutes',
}

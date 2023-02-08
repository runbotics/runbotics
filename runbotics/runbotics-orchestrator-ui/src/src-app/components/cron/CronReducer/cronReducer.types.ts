export interface CronStateProps {
    months?: number[] | undefined;
    monthDays?: number[] | undefined;
    nthMonthDays?: number[] | undefined;
    day?: number[] | undefined;
    weekDays?: number[] | undefined;
    nthWeekDays?: number[] | undefined;
    hours?: number[] | undefined;
    minutes?: number[] | undefined;
}

export interface CronActionProps {
    type: CRON_ACTIONS,
    payload: { 
        newValue?: number[] | undefined,
        newState?: CronStateProps,
    }
}

export enum CRON_ACTIONS {
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

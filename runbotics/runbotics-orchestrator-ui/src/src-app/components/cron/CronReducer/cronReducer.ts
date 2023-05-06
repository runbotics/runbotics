import { CRON_ACTIONS, CronActionProps, CronStateProps } from './cronReducer.types';

export const cronReducer = (state: CronStateProps, action: CronActionProps): CronStateProps => {
    const newValue = action?.payload?.newValue;
    const newState = action?.payload?.newState;

    switch (action.type) {
        case CRON_ACTIONS.CLEAR_ALL:
            const emptyObj = Object.fromEntries(Object.entries(state).map(([key]) => [key, []]));
            return { ...state, ...emptyObj };
        case CRON_ACTIONS.SET_ALL:
            const updatedObj = Object.fromEntries(Object.entries(state).map(([key]) => [key, newValue]));
            return { ...state, ...updatedObj };
        case CRON_ACTIONS.SET_EACH:
            return newState;
        case CRON_ACTIONS.SET_MONTHS:
            return { ...state, months: newValue };
        case CRON_ACTIONS.SET_MONTH_DAYS:
            return { ...state, monthDays: newValue };
        case CRON_ACTIONS.SET_NTH_MONTH_DAYS:
            return { ...state, nthMonthDays: newValue };
        case CRON_ACTIONS.SET_WEEK_DAYS:
            return { ...state, weekDays: newValue };
        case CRON_ACTIONS.SET_NTH_WEEK_DAYS:
            return { ...state, nthWeekDays: newValue };
        case CRON_ACTIONS.SET_HOURS:
            return { ...state, hours: newValue };
        case CRON_ACTIONS.SET_MINUTES:
            return { ...state, minutes: newValue };
        default: 
            throw new Error('Invalid action type');
    }
};

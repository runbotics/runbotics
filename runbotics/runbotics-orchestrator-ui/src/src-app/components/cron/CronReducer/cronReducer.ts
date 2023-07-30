import { CronActions, CronActionProps, CronStateProps } from './cronReducer.types';

export const cronReducer = (state: CronStateProps, action: CronActionProps): CronStateProps => {
    const newValue = action?.payload?.newValue;
    const newState = action?.payload?.newState;

    switch (action.type) {
        case CronActions.CLEAR_ALL:
            const emptyObj = Object.fromEntries(Object.entries(state).map(([key]) => [key, []]));
            return { ...state, ...emptyObj };
        case CronActions.SET_ALL:
            const updatedObj = Object.fromEntries(Object.entries(state).map(([key]) => [key, newValue]));
            return { ...state, ...updatedObj };
        case CronActions.SET_EACH:
            return newState;
        case CronActions.SET_MONTHS:
            return { ...state, months: newValue };
        case CronActions.SET_MONTH_DAYS:
            return { ...state, monthDays: newValue };
        case CronActions.SET_NTH_MONTH_DAYS:
            return { ...state, nthMonthDays: newValue };
        case CronActions.SET_WEEK_DAYS:
            return { ...state, weekDays: newValue };
        case CronActions.SET_NTH_WEEK_DAYS:
            return { ...state, nthWeekDays: newValue };
        case CronActions.SET_HOURS:
            return { ...state, hours: newValue };
        case CronActions.SET_MINUTES:
            return { ...state, minutes: newValue };
        default:
            throw new Error('Invalid action type');
    }
};

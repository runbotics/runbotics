import { FieldProps, SetValueNumbersOrUndefined } from '#src-app/components/cron/types';

export interface NthWeekDaysSelectProps extends Omit<FieldProps, 'setValue'> {
    humanizeLabels: boolean;
    setValue: SetValueNumbersOrUndefined;
    isOneWeekDaySelected: boolean;
    isMonthPeriodDisplayed: boolean;
}

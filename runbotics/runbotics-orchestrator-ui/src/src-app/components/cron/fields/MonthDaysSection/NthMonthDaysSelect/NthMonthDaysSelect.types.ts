import { FieldProps, SetValueNumbersOrUndefined } from '#src-app/components/cron/types';

export interface NthMonthDaysSelectProps extends Omit<FieldProps, 'setValue'> {
    humanizeLabels: boolean;
    setValue: SetValueNumbersOrUndefined;
}

import { FieldProps, SetValueNumbersOrUndefined } from '#src-app/components/cron/types';

export interface NthMonthDaysProps extends Omit<FieldProps, 'setValue'> {
    humanizeLabels: boolean;
    setValue: SetValueNumbersOrUndefined;
}

import { FieldProps, LeadingZero, SetValueNumbersOrUndefined } from '../../types';

export interface AllMonthDaysProps extends Omit<FieldProps, 'setValue'> {
    humanizeLabels: boolean;
    monthDays: number[];
    setMonthDays: SetValueNumbersOrUndefined;
    nthMonthDays: number[];
    setNthMonthDays: SetValueNumbersOrUndefined;
    leadingZero: LeadingZero;
}

import { FieldProps, LeadingZero } from '../../types';

export interface MonthDaysSectionProps extends Omit<FieldProps, 'setValue'> {
    humanizeLabels: boolean;
    monthDays: number[];
    setMonthDays: (newValue: number[]) => void;
    nthMonthDays: number[];
    setNthMonthDays: (newValue: number[]) => void;
    leadingZero: LeadingZero;
}

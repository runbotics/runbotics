import { FieldProps, LeadingZero } from '#src-app/components/cron/types';

export interface MonthDaysProps extends FieldProps {
    humanizeLabels: boolean;
    weekDays?: number[];
    leadingZero: LeadingZero;
}

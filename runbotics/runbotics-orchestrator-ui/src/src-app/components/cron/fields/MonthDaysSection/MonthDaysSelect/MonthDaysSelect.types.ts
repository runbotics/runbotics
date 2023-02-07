import { FieldProps, LeadingZero } from '#src-app/components/cron/types';

export interface MonthDaysSelectProps extends FieldProps {
    humanizeLabels: boolean;
    weekDays?: number[];
    leadingZero: LeadingZero;
}

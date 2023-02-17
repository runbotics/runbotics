import { ClockFormat, FieldProps, LeadingZero } from '../../types';

export interface HoursSelectProps extends FieldProps {
    leadingZero: LeadingZero;
    clockFormat?: ClockFormat;
}

import { ClockFormat, FieldProps, LeadingZero } from '../../types';

export interface HoursProps extends FieldProps {
    leadingZero: LeadingZero;
    clockFormat?: ClockFormat;
}

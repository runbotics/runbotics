import { ClockFormat, FieldProps, LeadingZero } from '../../types';


export interface MinutesSelectProps extends FieldProps {
    leadingZero: LeadingZero;
    clockFormat?: ClockFormat;
}

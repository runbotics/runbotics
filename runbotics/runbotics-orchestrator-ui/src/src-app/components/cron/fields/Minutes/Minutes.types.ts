import { ClockFormat, FieldProps, LeadingZero } from '../../types';


export interface MinutesProps extends FieldProps {
    leadingZero: LeadingZero;
    clockFormat?: ClockFormat;
}

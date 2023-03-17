import { FieldProps, PeriodType, SetValuePeriod, Shortcuts } from '../../types';

export interface PeriodProps extends Omit<FieldProps, 'value' | 'setValue' | 'period'> {
    value: PeriodType;
    setValue: SetValuePeriod;
    shortcuts: Shortcuts;
}

import { SelectProps } from '@mui/material';

import { ClockFormat, LeadingZero, PeriodType, SetValueNumbersOrUndefined, Unit, Locale } from '../../types';

export interface CustomSelectProps
    extends Omit<
    SelectProps,
    | 'mode'
    | 'tokenSeparators'
    | 'allowClear'
    | 'virtual'
    | 'onClick'
    | 'onBlur'
    | 'tagRender'
    | 'dropdownRender'
    | 'showSearch'
    | 'showArrow'
    | 'onChange'
    | 'dropdownMatchSelectWidth'
    | 'options'
    | 'onSelect'
    | 'onDeselect'
    > {
    grid?: boolean;
    setValue: SetValueNumbersOrUndefined;
    optionsList?: string[];
    locale: Locale;
    value?: number[];
    humanizeLabels?: boolean;
    disabled: boolean;
    readOnly: boolean;
    leadingZero?: LeadingZero;
    clockFormat?: ClockFormat;
    period: PeriodType;
    unit: Unit;
    isMultiple?: boolean;
}

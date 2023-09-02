import React, { FC } from 'react';

import { MonthDaysSelectProps } from './MonthDaysSelect.types';
import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';

const MonthDaysSelect: FC<MonthDaysSelectProps> = ({ 
    value, 
    setValue, 
    locale, 
    className, 
    disabled, 
    readOnly, 
    leadingZero, 
    period 
}) => (
    <CustomSelect
        value={value}
        setValue={setValue}
        unit={UNITS[UnitIndex.MONTH_DAYS]}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        leadingZero={leadingZero}
        period={period}
    />
);

export default MonthDaysSelect;

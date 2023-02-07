import React, { FC } from 'react';

import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';
import { MonthDaysProps } from './MonthDays.types';

const MonthDays: FC<MonthDaysProps> = ({ 
    value, 
    setValue, 
    locale, 
    className, 
    disabled, 
    readOnly, 
    leadingZero, 
    period 
}: MonthDaysProps) => (
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

export default MonthDays;

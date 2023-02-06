import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import { UNITS } from '../../constants';
import { MonthDaysProps } from '../../types';

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
        unit={UNITS[2]}
        locale={locale}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        leadingZero={leadingZero}
        period={period}
    />
);

export default MonthDays;

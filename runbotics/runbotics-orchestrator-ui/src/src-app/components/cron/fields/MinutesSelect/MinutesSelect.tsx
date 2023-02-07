import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import { PeriodType } from '../../types';
import { MinutesSelectProps } from './MinutesSelect.types';

// eslint-disable-next-line complexity
const MinutesSelect: FC<MinutesSelectProps> = ({ 
    value, 
    setValue, 
    locale, 
    className, 
    disabled, 
    readOnly, 
    leadingZero, 
    clockFormat, 
    period 
}) => (
    <>
        <PeriodDefinition 
            isDisplayed={period === PeriodType.HOUR}
            locale={locale}
            localeKey='prefixMinutesForHourPeriod'
        />
        <PeriodDefinition 
            isDisplayed={period !== PeriodType.HOUR}
            locale={locale}
            localeKey='prefixMinutes'
        />
        <CustomSelect
            value={value}
            unit={UNITS[UnitIndex.MINUTES]}
            setValue={setValue}
            locale={locale}
            className={className}
            disabled={disabled}
            readOnly={readOnly}
            leadingZero={leadingZero}
            clockFormat={clockFormat}
            period={period}
        />
        <PeriodDefinition 
            isDisplayed={period === PeriodType.HOUR}
            locale={locale}
            localeKey='suffixMinutesForHourPeriod'
        />
    </>
);

export default MinutesSelect;


import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import DEFAULT_LOCALE_EN from '../../locale';
import { PeriodType } from '../../types';
import { MinutesProps } from './Minutes.types';

// eslint-disable-next-line complexity
const Minutes: FC<MinutesProps> = ({ 
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
            placeholder={
                period === PeriodType.HOUR
                    ? locale.emptyMinutesForHourPeriod || DEFAULT_LOCALE_EN.emptyMinutesForHourPeriod
                    : locale.emptyMinutes || DEFAULT_LOCALE_EN.emptyMinutes
            }
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

export default Minutes;


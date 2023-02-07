import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import DEFAULT_LOCALE_EN from '../../locale';
import { PeriodType } from '../../types';
import { HoursProps } from './Hours.types';

const Hours: FC<HoursProps> = ({
    value, 
    setValue, 
    locale, 
    className, 
    disabled, 
    readOnly, 
    leadingZero, 
    clockFormat, 
    period,
}) => (
    <>
        <PeriodDefinition
            isDisplayed={period !== PeriodType.HOUR}
            localeKey='prefixHours'
            locale={locale}
        />
        <CustomSelect
            placeholder={locale.emptyHours || DEFAULT_LOCALE_EN.emptyHours}
            value={value}
            unit={UNITS[UnitIndex.HOURS]}
            setValue={setValue}
            locale={locale}
            className={className}
            disabled={disabled}
            readOnly={readOnly}
            leadingZero={leadingZero}
            clockFormat={clockFormat}
            period={period}
        />
    </>
);

export default Hours;

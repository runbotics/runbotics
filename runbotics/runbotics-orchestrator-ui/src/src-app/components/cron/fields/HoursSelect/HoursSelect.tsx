import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import DEFAULT_LOCALE_EN from '../../locale';
import { PeriodType } from '../../types';
import { HoursSelectProps } from './HoursSelect.types';

const HoursSelect: FC<HoursSelectProps> = ({
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

export default HoursSelect;

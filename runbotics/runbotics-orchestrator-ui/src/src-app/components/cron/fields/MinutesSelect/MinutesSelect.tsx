import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import { PeriodType } from '../../types';
import { MinutesSelectProps } from './MinutesSelect.types';

import If from '#src-app/components/utils/If';

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
        <If condition={period === PeriodType.HOUR}>
            <PeriodDefinition 
                locale={locale}
                localeKey='prefixMinutesForHourPeriod'
            />
        </If>
        <If condition={period !== PeriodType.HOUR}>
            <PeriodDefinition 
                locale={locale}
                localeKey='prefixMinutes'
            />
        </If>
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
        <If condition={period === PeriodType.HOUR}>
            <PeriodDefinition 
                locale={locale}
                localeKey='suffixMinutesForHourPeriod'
            />
        </If>
    </>
);

export default MinutesSelect;


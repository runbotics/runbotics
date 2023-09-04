import React, { FC } from 'react';

import If from '#src-app/components/utils/If';

import { HoursSelectProps } from './HoursSelect.types';
import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import { PeriodType } from '../../types';


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
        <If condition={period !== PeriodType.HOUR}>
            <PeriodDefinition
                localeKey='prefixHours'
                locale={locale}
            />
        </If>
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

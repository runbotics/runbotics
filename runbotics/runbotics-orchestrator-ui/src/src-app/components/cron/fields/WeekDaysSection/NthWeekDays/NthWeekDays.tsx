import React, { FC } from 'react';

import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';
import { PeriodType } from '../../../types';
import { NthWeekDaysProps } from './NthWeekDays.types';

// eslint-disable-next-line complexity
const NthWeekDays: FC<NthWeekDaysProps>= ({ 
    value, 
    setValue, 
    locale, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
    isAnyWeekDaySelected,
    isMonthPeriodDisplayed,
}) => {
    const optionsList = locale.nthWeekDays || DEFAULT_LOCALE_EN.nthWeekDays;
    const displayNthWeekDays = isMonthPeriodDisplayed && period !== PeriodType.WEEK;

    return displayNthWeekDays ? (
        <CustomSelect
            period={period}
            optionsList={optionsList}
            grid={false}
            value={value}
            unit={{
                ...UNITS[UnitIndex.NTH_WEEK_DAYS],
                alt: locale.altNthWeekDays || DEFAULT_LOCALE_EN.altNthWeekDays,
            }}
            setValue={setValue}
            locale={locale}
            humanizeLabels={humanizeLabels}
            disabled={disabled || !isAnyWeekDaySelected}
            readOnly={readOnly}
            isMultiple={false}
        />
    ) : null;
};

export default NthWeekDays;


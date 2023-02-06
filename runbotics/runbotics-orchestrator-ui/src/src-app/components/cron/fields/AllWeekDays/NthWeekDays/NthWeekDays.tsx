import React, { FC } from 'react';

import CustomSelect from '../../../components/CustomSelect';
import { UNITS } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';
import { PeriodTypes } from '../../../types';
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
    const displayNthWeekDays = isMonthPeriodDisplayed && period !== PeriodTypes.WEEK;

    return displayNthWeekDays ? (
        <CustomSelect
            period={period}
            optionsList={optionsList}
            grid={false}
            value={value}
            unit={{
                ...UNITS[5],
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


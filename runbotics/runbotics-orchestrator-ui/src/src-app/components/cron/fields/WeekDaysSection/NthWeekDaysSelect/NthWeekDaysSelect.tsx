import React, { FC } from 'react';

import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';
import { NthWeekDaysSelectProps } from './NthWeekDaysSelect.types';

// eslint-disable-next-line complexity
const NthWeekDaysSelect: FC<NthWeekDaysSelectProps>= ({ 
    value, 
    setValue, 
    locale, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
    isAnyWeekDaySelected,
}) => {
    const optionsList = locale.nthWeekDays || DEFAULT_LOCALE_EN.nthWeekDays;

    return (
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
    );
};

export default NthWeekDaysSelect;


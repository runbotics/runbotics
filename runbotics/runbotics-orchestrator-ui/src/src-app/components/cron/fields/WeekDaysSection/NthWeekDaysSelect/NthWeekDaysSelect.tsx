import React, { FC, useEffect } from 'react';

import { NthWeekDaysSelectProps } from './NthWeekDaysSelect.types';
import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';

const NthWeekDaysSelect: FC<NthWeekDaysSelectProps>= ({ 
    value, 
    setValue, 
    locale, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
    isOneWeekDaySelected,
}) => {
    const optionsList = locale.nthWeekDays || DEFAULT_LOCALE_EN.nthWeekDays;

    useEffect(() => {
        if(!isOneWeekDaySelected) {
            setValue([]); 
        }
    }, [isOneWeekDaySelected, setValue]);

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
            disabled={disabled || !isOneWeekDaySelected}
            readOnly={readOnly}
            isMultiple={false}
        />
    );
};

export default NthWeekDaysSelect;


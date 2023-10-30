import React from 'react';

import { WeekDaysSelectProps } from './WeekDaysSelect.types';
import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';

const WeekDaysSelect = ({ 
    value, 
    setValue, 
    locale, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
}: WeekDaysSelectProps) => {
    const optionsList = locale.weekDays || DEFAULT_LOCALE_EN.weekDays;

    return (
        <CustomSelect 
            period={period}
            optionsList={optionsList}
            grid={false}
            value={value}
            unit={{
                ...UNITS[UnitIndex.WEEK_DAYS],
                alt: locale.altWeekDays || DEFAULT_LOCALE_EN.altWeekDays,
            }}
            setValue={setValue}
            locale={locale}
            humanizeLabels={humanizeLabels}
            disabled={disabled}
            readOnly={readOnly}
        />
    );
};

export default WeekDaysSelect;


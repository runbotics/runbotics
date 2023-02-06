import React from 'react';

import CustomSelect from '../../../components/CustomSelect';
import { UNITS } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';
import { WeekDaysProps } from '../../../types';

// eslint-disable-next-line complexity
const WeekDays = ({ 
    value, 
    setValue, 
    locale, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
}: WeekDaysProps) => {
    const optionsList = locale.weekDays || DEFAULT_LOCALE_EN.weekDays;

    return (
        <CustomSelect 
            period={period}
            optionsList={optionsList}
            grid={false}
            value={value}
            unit={{
                ...UNITS[4],
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

export default WeekDays;


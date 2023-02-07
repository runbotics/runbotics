import React, { FC } from 'react';

import CustomSelect from '../../../components/CustomSelect';
import { UNITS } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';
import { NthMonthDaysProps } from './NthMonthDays.types';

// eslint-disable-next-line complexity
const NthMonthDays: FC<NthMonthDaysProps>= ({ 
    value, 
    setValue, 
    locale, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
}) => {
    const optionsList = locale.nthMonthDays || DEFAULT_LOCALE_EN.nthMonthDays;
    
    return (
        <CustomSelect
            period={period}
            optionsList={optionsList}
            grid={false}
            value={value}
            unit={{
                ...UNITS[5],
                alt: locale.altNthMonthDays || DEFAULT_LOCALE_EN.altNthMonthDays,
            }}
            setValue={setValue}
            locale={locale}
            humanizeLabels={humanizeLabels}
            disabled={disabled}
            readOnly={readOnly}
            isMultiple={false}
        />
    );
};

export default NthMonthDays;


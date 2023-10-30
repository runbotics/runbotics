import React, { FC } from 'react';

import { NthMonthDaysSelectProps } from './NthMonthDaysSelect.types';
import CustomSelect from '../../../components/CustomSelect';
import { UNITS, UnitIndex } from '../../../constants';
import DEFAULT_LOCALE_EN from '../../../locale';

const NthMonthDaysSelect: FC<NthMonthDaysSelectProps>= ({ 
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
                ...UNITS[UnitIndex.NTH_MONTH_DAYS],
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

export default NthMonthDaysSelect;


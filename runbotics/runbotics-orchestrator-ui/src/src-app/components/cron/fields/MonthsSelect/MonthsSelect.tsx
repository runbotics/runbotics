import React, { FC } from 'react';

import { MonthsSelectProps } from './MonthsSelect.types';
import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import DEFAULT_LOCALE_EN from '../../locale';

const MonthsSelect: FC<MonthsSelectProps> = ({
    value, 
    setValue, 
    locale, 
    className, 
    humanizeLabels, 
    disabled, 
    readOnly, 
    period,
}) => {
    const optionsList = locale.months || DEFAULT_LOCALE_EN.months;

    return (
        <>
            <PeriodDefinition
                locale={locale}
                localeKey='prefixMonths'
            />
            <CustomSelect
                optionsList={optionsList}
                grid={false}
                value={value}
                unit={{
                    ...UNITS[UnitIndex.MONTHS],
                    // Allow translation of alternative labels when using "humanizeLabels"
                    alt: locale.altMonths || DEFAULT_LOCALE_EN.altMonths,
                }}
                setValue={setValue}
                locale={locale}
                className={className}
                humanizeLabels={humanizeLabels}
                disabled={disabled}
                readOnly={readOnly}
                period={period}
            />
        </>
    );
};

export default MonthsSelect;

import React, { FC } from 'react';

import CustomSelect from '../../components/CustomSelect';
import PeriodDefinition from '../../components/PeriodDefinition';
import { UNITS, UnitIndex } from '../../constants';
import DEFAULT_LOCALE_EN from '../../locale';
import { MonthsProps } from './Months.types';

// eslint-disable-next-line complexity
const Months: FC<MonthsProps> = ({
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
                isDisplayed={true}
                locale={locale}
                localeKey='prefixMonths'
            />
            <CustomSelect
                placeholder={locale.emptyMonths || DEFAULT_LOCALE_EN.emptyMonths}
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

export default Months;

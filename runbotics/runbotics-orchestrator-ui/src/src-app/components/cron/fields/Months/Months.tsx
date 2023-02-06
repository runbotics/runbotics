import React, { FC, useMemo } from 'react';

import CustomSelect from '../../components/CustomSelect';
import { UNITS } from '../../constants';
import DEFAULT_LOCALE_EN from '../../locale';
import { classNames } from '../../utils';
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

    const internalClassName = useMemo(
        () => classNames({
            'react-js-cron-field': true,
            'react-js-cron-months': true,
            [`${className}-field`]: !!className,
            [`${className}-months`]: !!className,
        }),
        [className],
    );

    return (
        <div className={internalClassName}>
            {locale.prefixMonths !== '' && <span>{locale.prefixMonths || DEFAULT_LOCALE_EN.prefixMonths}</span>}

            <CustomSelect
                placeholder={locale.emptyMonths || DEFAULT_LOCALE_EN.emptyMonths}
                optionsList={optionsList}
                grid={false}
                value={value}
                unit={{
                    ...UNITS[3],
                    // Allow translation of alternative labels when using "humanizeLabels"
                    // Issue #3
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
        </div>
    );
};

export default Months;

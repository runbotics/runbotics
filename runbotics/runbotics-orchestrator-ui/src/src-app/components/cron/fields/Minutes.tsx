import React, { useMemo } from 'react';

import CustomSelect from '../components/CustomSelect';
import { UNITS } from '../constants';
import DEFAULT_LOCALE_EN from '../locale';
import { MinutesProps, PeriodTypes } from '../types';
import { classNames } from '../utils';

// eslint-disable-next-line complexity
export default function Minutes({ 
    value, 
    setValue, 
    locale, 
    className, 
    disabled, 
    readOnly, 
    leadingZero, 
    clockFormat, 
    period 
}: MinutesProps) {
    const internalClassName = useMemo(
        () =>
            classNames({
                'react-js-cron-field': true,
                'react-js-cron-minutes': true,
                [`${className}-field`]: !!className,
                [`${className}-minutes`]: !!className,
            }),
        [className],
    );

    const fieldPrefix = useMemo(
        () =>
            period === PeriodTypes.HOUR 
                ? (
                    <span>
                        {locale.prefixMinutesForHourPeriod || DEFAULT_LOCALE_EN.prefixMinutesForHourPeriod}
                    </span>
                ) 
                : (
                    <span>
                        {locale.prefixMinutes || DEFAULT_LOCALE_EN.prefixMinutes}
                    </span>
                ),
        [period, locale.prefixMinutesForHourPeriod, locale.prefixMinutes]
    );

    const fieldSuffix = useMemo(
        () =>
            period === PeriodTypes.HOUR
                ? (
                    <span>
                        {locale.suffixMinutesForHourPeriod || DEFAULT_LOCALE_EN.suffixMinutesForHourPeriod}
                    </span>
                ) 
                : null,
        [period, locale.suffixMinutesForHourPeriod]
    );

    return (
        <div className={internalClassName}>
            {fieldPrefix}
            <CustomSelect
                placeholder={
                    period === PeriodTypes.HOUR
                        ? locale.emptyMinutesForHourPeriod || DEFAULT_LOCALE_EN.emptyMinutesForHourPeriod
                        : locale.emptyMinutes || DEFAULT_LOCALE_EN.emptyMinutes
                }
                value={value}
                unit={UNITS[0]}
                setValue={setValue}
                locale={locale}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                leadingZero={leadingZero}
                clockFormat={clockFormat}
                period={period}
            />
            {fieldSuffix}
        </div>
    );
}

import React, { useCallback, useMemo } from 'react';

import { Select, MenuItem, SvgIcon } from '@mui/material';
import { Calendar as CalendarIcon } from 'react-feather';

import DEFAULT_LOCALE_EN from '../locale';
import { PeriodProps, PeriodType } from '../types';
import { classNames } from '../utils';

// eslint-disable-next-line complexity
export default function Period(props: PeriodProps) {
    const { value, setValue, locale, className, disabled, readOnly, shortcuts } = props;
    let options = [
        {
            value: PeriodType.YEAR,
            label: locale.yearOption || DEFAULT_LOCALE_EN.yearOption,
        },
        {
            value: PeriodType.MONTH,
            label: locale.monthOption || DEFAULT_LOCALE_EN.monthOption,
        },
        {
            value: PeriodType.WEEK,
            label: locale.weekOption || DEFAULT_LOCALE_EN.weekOption,
        },
        {
            value: PeriodType.DAY,
            label: locale.dayOption || DEFAULT_LOCALE_EN.dayOption,
        },
        {
            value: PeriodType.HOUR,
            label: locale.hourOption || DEFAULT_LOCALE_EN.hourOption,
        },
        {
            value: PeriodType.MINUTE,
            label: locale.minuteOption || DEFAULT_LOCALE_EN.minuteOption,
        },
    ];

    if (shortcuts && (shortcuts === true || shortcuts.includes('@reboot')))
    { options = [
        ...options,
        {
            value: PeriodType.REBOOT,
            label: locale.rebootOption || DEFAULT_LOCALE_EN.rebootOption,
        },
    ]; }

    const handleChange = useCallback(
        (event) => {
            if (!readOnly) setValue(event.target.value);
        },
        [setValue, readOnly],
    );

    const internalClassName = useMemo(
        () =>
            classNames({
                'react-js-cron-field': true,
                'react-js-cron-period': true,
                [`${className}-field`]: !!className,
                [`${className}-period`]: !!className,
            }),
        [className],
    );

    const selectClassName = useMemo(
        () =>
            classNames({
                'react-js-cron-select': true,
                'react-js-cron-select-no-prefix': locale.prefixPeriod === '',
                [`${className}-select`]: !!className,
            }),
        [className, locale.prefixPeriod],
    );

    return (
        <div className={internalClassName}>
            <SvgIcon fontSize="small">
                <CalendarIcon />
            </SvgIcon>
            {locale.prefixPeriod !== '' && <span>{locale.prefixPeriod || DEFAULT_LOCALE_EN.prefixPeriod}</span>}

            <Select
                key={JSON.stringify(locale)}
                defaultValue={value}
                value={value}
                onChange={handleChange}
                className={selectClassName}
                disabled={disabled}
                open={readOnly ? false : undefined}
            >
                {options.map((obj) => (
                    <MenuItem key={obj.value} value={obj.value}>
                        {obj.label}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
}

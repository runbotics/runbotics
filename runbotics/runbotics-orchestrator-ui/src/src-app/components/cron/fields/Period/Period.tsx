import React, { FC, useCallback } from 'react';

import { MenuItem, SvgIcon } from '@mui/material';
import { Calendar as CalendarIcon } from 'react-feather';

import PeriodDefinition from '../../components/PeriodDefinition';
import DEFAULT_LOCALE_EN from '../../locale';
import { PeriodType } from '../../types';
import { PeriodContainer, PeriodSelect } from './Period.styles';
import { PeriodProps } from './Period.types';

// eslint-disable-next-line complexity
const Period: FC<PeriodProps> = ({ value, setValue, locale, disabled, readOnly }) => {
    const options = [
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

    const handleChange = useCallback(
        (event) => {
            if (!readOnly) setValue(event.target.value);
        },
        [setValue, readOnly],
    );

    return (
        <PeriodContainer>
            <SvgIcon fontSize="small">
                <CalendarIcon />
            </SvgIcon>
            <PeriodDefinition
                locale={locale}
                localeKey="prefixPeriod"
            />
            <PeriodSelect
                key={JSON.stringify(locale)}
                defaultValue={value}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                open={readOnly ? false : undefined}
            >
                {options.map((obj) => (
                    <MenuItem key={obj.value} value={obj.value}>
                        {obj.label}
                    </MenuItem>
                ))}
            </PeriodSelect>
        </PeriodContainer>
    );
};

export default Period;

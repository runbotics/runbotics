import React, { useMemo, useCallback } from 'react';
import { Select, MenuItem } from '@mui/material';
import { CustomSelectProps } from '../types';
import DEFAULT_LOCALE_EN from '../locale';
import { classNames, sort } from '../utils';
import { parsePartArray, partToString, formatValue } from '../converter';

export default function CustomSelect(props: CustomSelectProps) {
    const {
        value,
        setValue,
        locale,
        className,
        humanizeLabels,
        disabled,
        readOnly,
        leadingZero,
        clockFormat,
        optionsList,
        unit,
    } = props;

    const stringValue = useMemo(() => {
        if (value && Array.isArray(value)) {
            return value.map((item: number) => item.toString());
        }
        return [];
    }, [value]);

    const options = useMemo(
        () => {
            if (optionsList) {
                return optionsList.map((option, index) => {
                    const number = unit.min === 0 ? index : index + 1;
                    return {
                        value: number.toString(),
                        label: option,
                    };
                });
            }
            return [...Array(unit.total)].map((e, index) => {
                const number = unit.min === 0 ? index : index + 1;
                return {
                    value: number.toString(),
                    label: formatValue(number, unit, humanizeLabels, leadingZero, clockFormat),
                };
            });
        },
        [optionsList, unit, humanizeLabels, leadingZero, clockFormat],
    );
    const renderTag = useCallback(
        (tagProps) => {
            const propsValue = tagProps;

            if (!propsValue || Number.isNaN((propsValue[0]))) {
                return <></>;
            }

            const parsedArray = parsePartArray(propsValue, unit);
            const cronValue = partToString(parsedArray, unit, humanizeLabels, leadingZero, clockFormat);
            const testEveryValue = (/^\*\/([0-9]+),?/.exec(cronValue)) || [];

            return (
                <div>
                    {testEveryValue[1]
                        ? `${locale.everyText || DEFAULT_LOCALE_EN.everyText} 
            ${testEveryValue[1]}`
                        : cronValue}
                </div>
            );
        },
        [unit, humanizeLabels, leadingZero, clockFormat, locale.everyText],
    );

    const simpleClick = useCallback(
        (event) => {
            let newValueOption: number[] = event.target.value;
            if (newValueOption.length === 0) {
                newValueOption.push(0);
            }
            newValueOption = Array.isArray(newValueOption) ? sort(newValueOption) : [newValueOption];
            const newValue: number[] = newValueOption;
            if (newValue.length === unit.total) {
                setValue([]);
            } else {
                setValue(newValue);
            }
        },
        [setValue, unit.total],
    );

    const internalClassName = useMemo(
        () => classNames({
            'react-js-cron-select': true,
            'react-js-cron-custom-select': true,
            [`${className}-select`]: !!className,
        }),
        [className],
    );

    return (
        <Select
            multiple
            open={readOnly ? false : undefined}
            value={stringValue}
            onChange={simpleClick}
            renderValue={renderTag}
            className={internalClassName}
            autoWidth={false}
            disabled={disabled}
        >
            {options.map((obj) => (
                <MenuItem key={obj.value} value={obj.value}>
                    {obj.label}
                </MenuItem>
            ))}
        </Select>
    );
}

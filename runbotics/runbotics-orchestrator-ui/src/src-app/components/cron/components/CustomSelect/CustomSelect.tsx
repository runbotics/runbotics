import React, { useMemo, useCallback, FC } from 'react';

import { MenuItem } from '@mui/material';

import { StyledSelect } from './CustomSelect.styles';
import { CustomSelectProps } from './CustomSelect.types';
import { parsePartArray, partToString, formatValue } from '../../converter';
import DEFAULT_LOCALE_EN from '../../locale';
import { sort } from '../../utils';

const CustomSelect: FC<CustomSelectProps> = ({
    value,
    setValue,
    locale,
    humanizeLabels,
    disabled,
    readOnly,
    leadingZero,
    clockFormat,
    optionsList,
    unit,
    isMultiple = true,
}) => {
    const stringValue = useMemo(
        () =>
            (value && Array.isArray(value))
                ? value.map((item: number) => item.toString())
                : [],
        [value]
    );

    const options = useMemo(
        () => optionsList
            ? (
                optionsList.map(
                    (option, index) => {
                        const number = unit.min === 0 ? index : index + 1;

                        return {
                            value: number.toString(),
                            label: option,
                        };
                    }
                )
            )
            : (
                [...Array(unit.total)].map((e, index) => {
                    const number = unit.min === 0 ? index : index + 1;

                    return {
                        value: number.toString(),
                        label: formatValue(
                            number,
                            unit,
                            humanizeLabels,
                            leadingZero,
                            clockFormat
                        ),
                    };
                })
            ),
        [optionsList, unit, humanizeLabels, leadingZero, clockFormat],
    );

    const renderTag = useCallback(
        (tagProps) => {
            const propsValue = tagProps;

            if (!propsValue || Number.isNaN((propsValue[0])))
            { return <></>; }


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
            const newValue = event.target.value;

            if(Array.isArray(newValue)) {
                const newArray = sort(newValue);
                newValue.length === unit.total ? setValue([]) : setValue(newArray);
            } else {
                newValue === value[0] ? setValue([]) : setValue([newValue]);
            }
        },
        [setValue, unit.total, value],
    );

    return (
        <StyledSelect
            multiple={isMultiple}
            open={readOnly ? false : undefined}
            value={stringValue}
            onChange={simpleClick}
            renderValue={renderTag}
            autoWidth={false}
            disabled={disabled}
            required
            error={!value.length}
        >
            {options.map((obj) => (
                <MenuItem key={obj.value} value={obj.value}>
                    {obj.label}
                </MenuItem>
            ))}
        </StyledSelect>
    );
};

export default CustomSelect;

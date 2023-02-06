/* eslint-disable complexity */
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

import If from '../utils/If';
import { setValuesFromCronString, getCronStringFromValues } from './converter';
import { ClearButton } from './Cron.styles';
import AllMonthDays from './fields/AllMonthDays/';
import AllWeekDays from './fields/AllWeekDays/';
import Hours from './fields/Hours/Hours';
import Minutes from './fields/Minutes/Minutes';
import Months from './fields/Months/Months';
import Period from './fields/Period';
import DEFAULT_LOCALE_EN from './locale';
import { CronProps, PeriodType, PeriodTypes } from './types';
import { classNames, setError, usePrevious } from './utils';

// eslint-disable-next-line max-lines-per-function
export default function Cron({
    clearButton = true,
    clearButtonAction = 'fill-with-every',
    locale = DEFAULT_LOCALE_EN,
    value = '',
    setValue,
    displayError = true,
    onError,
    className,
    defaultPeriod = PeriodTypes.DAY,
    allowEmpty = 'for-default-value',
    humanizeLabels = true,
    humanizeValue = false,
    disabled = false,
    readOnly = false,
    leadingZero = false,
    shortcuts = ['@yearly', '@annually', '@monthly', '@weekly', '@daily', '@midnight', '@hourly'],
    clockFormat,
}: CronProps) {
    const internalValueRef = useRef<string>(value);
    const defaultPeriodRef = useRef<PeriodType>(defaultPeriod);
    const [period, setPeriod] = useState<PeriodType | undefined>();
    const [monthDays, setMonthDays] = useState<number[] | undefined>();
    const [nthMonthDays, setNthMonthDays] = useState<number[] | undefined>();
    const [months, setMonths] = useState<number[] | undefined>();
    const [weekDays, setWeekDays] = useState<number[] | undefined>();
    const [nthWeekDays, setNthWeekDays] = useState<number[] | undefined>();
    const [hours, setHours] = useState<number[] | undefined>();
    const [minutes, setMinutes] = useState<number[] | undefined>();
    const [error, setInternalError] = useState<boolean>(false);
    const [valueCleared, setValueCleared] = useState<boolean>(false);
    const previousValueCleared = usePrevious(valueCleared);
    const localeJSON = JSON.stringify(locale);

    console.log(monthDays)

    useEffect(
        () => {
            setValuesFromCronString(
                value,
                setInternalError,
                onError,
                allowEmpty,
                internalValueRef,
                true,
                locale,
                shortcuts,
                setMinutes,
                setHours,
                setMonthDays,
                setNthMonthDays,
                setMonths,
                setWeekDays,
                setNthWeekDays,
                setPeriod,
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(
        () => {
            if (value !== internalValueRef.current)
            { 
                setValuesFromCronString(
                    value,
                    setInternalError,
                    onError,
                    allowEmpty,
                    internalValueRef,
                    false,
                    locale,
                    shortcuts,
                    setMinutes,
                    setHours,
                    setMonthDays,
                    setNthMonthDays,
                    setMonths,
                    setWeekDays,
                    setNthWeekDays,
                    setPeriod,
                ); 
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [value, internalValueRef, localeJSON, allowEmpty, shortcuts],
    );

    useEffect(
        () => {
            // Only change the value if a user touched a field
            // and if the user didn't use the clear button
            if (
                (period || minutes || months || monthDays || weekDays || hours || minutes) &&
                !valueCleared &&
                !previousValueCleared
            ) {
                const cron = getCronStringFromValues(
                    period || defaultPeriodRef.current,
                    months,
                    monthDays,
                    nthMonthDays,
                    weekDays,
                    nthWeekDays,
                    hours,
                    minutes,
                    humanizeValue,
                );

                setValue(cron);
                internalValueRef.current = cron;

                onError && onError(undefined);
                setInternalError(false);
            } else if (valueCleared) {
                setValueCleared(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [period, monthDays, months, weekDays, nthWeekDays, hours, minutes, nthMonthDays, humanizeValue, valueCleared],
    );

    const handleClear = useCallback(
        () => {
            setMonthDays(undefined);
            setMonths(undefined);
            setWeekDays(undefined);
            setNthWeekDays(undefined);
            setHours(undefined);
            setMinutes(undefined);
            setNthMonthDays(undefined);

            // When clearButtonAction is 'empty'
            let newValue = '';

            const newPeriod = period !== PeriodTypes.REBOOT && period ? period : defaultPeriodRef.current;

            if (newPeriod !== period) setPeriod(newPeriod);

            // When clearButtonAction is 'fill-with-every'
            if (clearButtonAction === 'fill-with-every') {
                const cron = getCronStringFromValues(newPeriod, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

                newValue = cron;
            }

            setValue(newValue);
            internalValueRef.current = newValue;

            setValueCleared(true);

            if (allowEmpty === 'never' && clearButtonAction === 'empty') {
                setInternalError(true);
                setError(onError, locale);
            } else {
                onError && onError(undefined);
                setInternalError(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [period, setValue, onError, clearButtonAction],
    );

    const internalClassName = useMemo(
        () =>
            classNames(
                {
                    'react-js-cron': true,
                    'react-js-cron-error': error && displayError,
                    'react-js-cron-disabled': disabled,
                    'react-js-cron-read-only': readOnly,
                    [`${className}`]: !!className,
                    [`${className}-error`]: error && displayError && !!className,
                    [`${className}-disabled`]: disabled && !!className,
                    [`${className}-read-only`]: readOnly && !!className,
                }
            ),
        [className, error, displayError, disabled, readOnly],
    );

    const clearButtonNode = useMemo(
        () => (
            (clearButton && !readOnly) 
                ? (
                    <ClearButton
                        variant="contained"
                        disabled={disabled}
                        onClick={handleClear}
                    >
                        {locale.clearButtonText || DEFAULT_LOCALE_EN.clearButtonText}
                    </ClearButton>
                ) : null
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [clearButton, readOnly, localeJSON, disabled, handleClear]
    );

    const periodForRender = period || defaultPeriodRef.current;

    const isRebootPeriodSelected = periodForRender === PeriodTypes.REBOOT;
    const isYearPeriodDisplayed = periodForRender === PeriodTypes.YEAR;
    const isMonthPeriodDisplayed = isYearPeriodDisplayed || periodForRender === PeriodTypes.MONTH;
    const isWeekPeriodDisplayed = isMonthPeriodDisplayed || periodForRender === PeriodTypes.WEEK;
    const isDayPeriodDisplayed = isWeekPeriodDisplayed || periodForRender === PeriodTypes.DAY;
    const isHourPeriodDisplayed = isDayPeriodDisplayed || periodForRender === PeriodTypes.HOUR;

    return (
        <div className={internalClassName}>
            <Period
                value={periodForRender}
                setValue={setPeriod}
                locale={locale}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                shortcuts={shortcuts}
            />
            <If condition={!isRebootPeriodSelected} else={clearButtonNode}>
                <If condition={isYearPeriodDisplayed}>
                    <Months
                        value={months}
                        setValue={setMonths}
                        locale={locale}
                        className={className}
                        humanizeLabels={humanizeLabels}
                        disabled={disabled}
                        readOnly={readOnly}
                        period={periodForRender}
                    />
                </If>
                <If condition={isMonthPeriodDisplayed}>
                    <AllMonthDays
                        locale={locale}
                        className={className}
                        humanizeLabels={humanizeLabels}
                        disabled={disabled}
                        readOnly={readOnly}
                        leadingZero={leadingZero}
                        period={periodForRender}
                        monthDays={monthDays}
                        setMonthDays={setMonthDays}
                        nthMonthDays={nthMonthDays}
                        setNthMonthDays={setNthMonthDays}
                    />
                </If>
                <If condition={isWeekPeriodDisplayed}>
                    <AllWeekDays 
                        locale={locale}
                        humanizeLabels={humanizeLabels}
                        disabled={disabled}
                        readOnly={readOnly}
                        periodForRender={periodForRender}
                        isMonthPeriodDisplayed={isMonthPeriodDisplayed}
                        isWeekPeriodDisplayed={isWeekPeriodDisplayed}
                        weekDays={weekDays}
                        setWeekDays={setWeekDays}
                        nthWeekDays={nthWeekDays}
                        setNthWeekDays={setNthWeekDays}
                    />
                </If>
                <If condition={isDayPeriodDisplayed}>
                    <Hours
                        value={hours}
                        setValue={setHours}
                        locale={locale}
                        className={className}
                        disabled={disabled}
                        readOnly={readOnly}
                        leadingZero={leadingZero}
                        clockFormat={clockFormat}
                        period={periodForRender}
                    />
                </If>
                <If condition={isHourPeriodDisplayed}>
                    <Minutes
                        value={minutes}
                        setValue={setMinutes}
                        locale={locale}
                        period={periodForRender}
                        className={className}
                        disabled={disabled}
                        readOnly={readOnly}
                        leadingZero={leadingZero}
                        clockFormat={clockFormat}
                    />
                    {clearButtonNode}
                </If>
            </If>
        </div>
    );
}

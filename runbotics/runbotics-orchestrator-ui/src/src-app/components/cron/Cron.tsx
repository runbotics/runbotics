/* eslint-disable complexity */
import React, { useState, useCallback, useEffect, useRef, useMemo, useReducer } from 'react';

import If from '../utils/If';
import { setValuesFromCronString, getCronStringFromValues } from './converter';
import { ClearButton } from './Cron.styles';
import Hours from './fields/Hours';
import Minutes from './fields/Minutes';
import MonthDaysSection from './fields/MonthDaysSection';
import Months from './fields/Months';
import Period from './fields/Period';
import WeekDaysSection from './fields/WeekDaysSection';
import DEFAULT_LOCALE_EN from './locale';
import { CronStateProps, CronProps, PeriodType, CRON_ACTIONS, CronActionProps } from './types';
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
    defaultPeriod = PeriodType.DAY,
    allowEmpty = 'for-default-value',
    humanizeLabels = true,
    humanizeValue = false,
    disabled = false,
    readOnly = false,
    leadingZero = false,
    shortcuts = ['@yearly', '@annually', '@monthly', '@weekly', '@daily', '@midnight', '@hourly'],
    clockFormat,
}: CronProps) {
    const cronReducer = (state: CronStateProps, action: CronActionProps): CronStateProps => {
        const newValue = action.payload.newValue;
        const newState = action.payload.newState;

        switch (action.type) {
            case CRON_ACTIONS.SET_ALL:
                const newObj = Object.fromEntries(Object.entries(state).map(([key]) => [key, newValue]));
                return newObj;
            case CRON_ACTIONS.SET_EACH:
                return newState;
            case CRON_ACTIONS.SET_MONTHS:
                return { ...state, months: newValue };
            case CRON_ACTIONS.SET_MONTH_DAYS:
                return { ...state, monthDays: newValue };
            case CRON_ACTIONS.SET_NTH_MONTH_DAYS:
                return { ...state, nthMonthDays: newValue };
            case CRON_ACTIONS.SET_WEEK_DAYS:
                return { ...state, weekDays: newValue };
            case CRON_ACTIONS.SET_NTH_WEEK_DAYS:
                return { ...state, nthWeekDays: newValue };
            case CRON_ACTIONS.SET_HOURS:
                return { ...state, hours: newValue };
            case CRON_ACTIONS.SET_MINUTES:
                return { ...state, minutes: newValue };
            default: 
                throw new Error('Invalid action type');
        }
    };

    const [cronState, cronDispatch] = useReducer(
        cronReducer, 
        {
            months: undefined,
            monthDays: undefined,
            nthMonthDays: undefined,
            weekDays: undefined,
            nthWeekDays: undefined,
            hours: undefined,
            minutes: undefined,
        }
    );

    const internalValueRef = useRef<string>(value);
    const defaultPeriodRef = useRef<PeriodType>(defaultPeriod);
    const [period, setPeriod] = useState<PeriodType | undefined>();
    const [error, setInternalError] = useState<boolean>(false);
    const [valueCleared, setValueCleared] = useState<boolean>(false);
    const previousValueCleared = usePrevious(valueCleared);
    const localeJSON = JSON.stringify(locale);
    
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
                setPeriod,
                cronDispatch,
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
                    setPeriod,
                    cronDispatch,
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
                (period || cronState.months || cronState.monthDays || cronState.weekDays || cronState.hours || cronState.minutes) &&
                !valueCleared &&
                !previousValueCleared
            ) {
                const cron = getCronStringFromValues(
                    period || defaultPeriodRef.current,
                    cronState,
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
        [period, cronState, humanizeValue, valueCleared],
    );

    const handleClear = useCallback(
        () => {
            cronDispatch({
                type: CRON_ACTIONS.SET_ALL,
                payload: {
                    newValue: undefined,
                },
            });

            // When clearButtonAction is 'empty'
            let newValue = '';

            const newPeriod = period !== PeriodType.REBOOT && period ? period : defaultPeriodRef.current;

            if (newPeriod !== period) setPeriod(newPeriod);

            // When clearButtonAction is 'fill-with-every'
            if (clearButtonAction === 'fill-with-every') {
                const cron = getCronStringFromValues(newPeriod, undefined, undefined);

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

    const isRebootPeriodSelected = periodForRender === PeriodType.REBOOT;
    const isYearPeriodDisplayed = periodForRender === PeriodType.YEAR;
    const isMonthPeriodDisplayed = isYearPeriodDisplayed || periodForRender === PeriodType.MONTH;
    const isWeekPeriodDisplayed = isMonthPeriodDisplayed || periodForRender === PeriodType.WEEK;
    const isDayPeriodDisplayed = isWeekPeriodDisplayed || periodForRender === PeriodType.DAY;
    const isHourPeriodDisplayed = isDayPeriodDisplayed || periodForRender === PeriodType.HOUR;

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
                        value={cronState.months}
                        setValue={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_MONTHS, payload: { newValue } })}
                        locale={locale}
                        className={className}
                        humanizeLabels={humanizeLabels}
                        disabled={disabled}
                        readOnly={readOnly}
                        period={periodForRender}
                    />
                </If>
                <If condition={isMonthPeriodDisplayed}>
                    <MonthDaysSection
                        locale={locale}
                        className={className}
                        humanizeLabels={humanizeLabels}
                        disabled={disabled}
                        readOnly={readOnly}
                        leadingZero={leadingZero}
                        period={periodForRender}
                        monthDays={cronState.monthDays}
                        setMonthDays={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_MONTH_DAYS, payload: { newValue } })}
                        nthMonthDays={cronState.nthMonthDays}
                        setNthMonthDays={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_NTH_MONTH_DAYS, payload: { newValue } })}
                    />
                </If>
                <If condition={isWeekPeriodDisplayed}>
                    <WeekDaysSection 
                        locale={locale}
                        humanizeLabels={humanizeLabels}
                        disabled={disabled}
                        readOnly={readOnly}
                        periodForRender={periodForRender}
                        isMonthPeriodDisplayed={isMonthPeriodDisplayed}
                        isWeekPeriodDisplayed={isWeekPeriodDisplayed}
                        weekDays={cronState.weekDays}
                        setWeekDays={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_WEEK_DAYS, payload: { newValue } })}
                        nthWeekDays={cronState.nthWeekDays}
                        setNthWeekDays={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_NTH_WEEK_DAYS, payload: { newValue } })}
                    />
                </If>
                <If condition={isDayPeriodDisplayed}>
                    <Hours
                        value={cronState.hours}
                        setValue={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_HOURS, payload: { newValue } })}
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
                        value={cronState.minutes}
                        setValue={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_MINUTES, payload: { newValue } })}
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

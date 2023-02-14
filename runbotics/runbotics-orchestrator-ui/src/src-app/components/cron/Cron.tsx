/* eslint-disable complexity */
import React, { useState, useCallback, useEffect, useRef, useMemo, useReducer } from 'react';

import If from '../utils/If';
import { setValuesFromCronString, getCronStringFromValues } from './converter';
import { ClearButton } from './Cron.styles';
import { cronReducer } from './CronReducer/cronReducer';
import { CRON_ACTIONS } from './CronReducer/cronReducer.types';
import HoursSelect from './fields/HoursSelect';
import MinutesSelect from './fields/MinutesSelect';
import MonthDaysSection from './fields/MonthDaysSection';
import MonthsSelect from './fields/MonthsSelect';
import Period from './fields/Period';
import WeekDaysSection from './fields/WeekDaysSection';
import DEFAULT_LOCALE_EN from './locale';
import { CronProps, PeriodType } from './types';
import { classNames, cronShortcuts, initialCronState, setError, usePrevious } from './utils';

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
    defaultPeriod = PeriodType.MINUTE,
    allowEmpty = 'for-default-value',
    humanizeLabels = true,
    humanizeValue = false,
    disabled = false,
    readOnly = false,
    leadingZero = false,
    shortcuts = cronShortcuts,
    clockFormat,
}: CronProps) {
    const [cronState, cronDispatch] = useReducer(cronReducer, initialCronState);
    const internalValueRef = useRef<string>(value);
    const defaultPeriodRef = useRef<PeriodType>(defaultPeriod);
    const [period, setPeriod] = useState<PeriodType>();
    const [error, setInternalError] = useState<boolean>(false);
    const [valueCleared, setValueCleared] = useState<boolean>(false);
    const previousValueCleared = usePrevious(valueCleared);
    const localeJSON = JSON.stringify(locale);

    useEffect(
        () => {            
            setValuesFromCronString({
                cronString: value,
                setInternalError,
                onError,
                allowEmpty,
                internalValueRef,
                firstRender: true,
                locale,
                shortcuts,
                setPeriod,
                cronDispatch
            });

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    
    useEffect(
        () => {
            if (value !== internalValueRef.current)
            { 
                setValuesFromCronString({
                    cronString: value,
                    setInternalError,
                    onError,
                    allowEmpty,
                    internalValueRef,
                    firstRender: false,
                    locale,
                    shortcuts,
                    setPeriod,
                    cronDispatch
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [value, localeJSON, allowEmpty, shortcuts],
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
                    newValue: [],
                },
            });

            // When clearButtonAction is 'empty'
            let newValue = '';

            const newPeriod = period !== PeriodType.REBOOT && period ? period : defaultPeriodRef.current;

            if (newPeriod !== period) setPeriod(newPeriod);

            // When clearButtonAction is 'fill-with-every'
            if (clearButtonAction === 'fill-with-every') {
                const cron = getCronStringFromValues(newPeriod, cronState, undefined);

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
                }
            ),
        [error, displayError, disabled, readOnly],
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
                    <MonthsSelect
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
                        weekDays={cronState.weekDays}
                        setWeekDays={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_WEEK_DAYS, payload: { newValue } })}
                        nthWeekDays={cronState.nthWeekDays}
                        setNthWeekDays={(newValue) => cronDispatch({ type: CRON_ACTIONS.SET_NTH_WEEK_DAYS, payload: { newValue } })}
                    />
                </If>
                <If condition={isDayPeriodDisplayed}>
                    <HoursSelect
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
                    <MinutesSelect
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

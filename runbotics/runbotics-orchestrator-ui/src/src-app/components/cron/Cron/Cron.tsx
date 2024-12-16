import React, { useState, useCallback, useEffect, useRef, useReducer, FC } from 'react';

import { ClearButton, CronContainer } from './Cron.styles';
import If from '../../utils/If';
import { setValuesFromCronString, getCronStringFromValues } from '../converter';
import { cronReducer } from '../CronReducer/cronReducer';
import { CRON_ACTIONS } from '../CronReducer/cronReducer.types';
import HoursSelect from '../fields/HoursSelect';
import MinutesSelect from '../fields/MinutesSelect';
import MonthDaysSection from '../fields/MonthDaysSection';
import MonthsSelect from '../fields/MonthsSelect';
import Period from '../fields/Period/Period';
import WeekDaysSection from '../fields/WeekDaysSection';
import DEFAULT_LOCALE_EN from '../locale';
import { CronProps, PeriodType } from '../types';
import { cronShortcuts, initialCronState } from '../utils';

// eslint-disable-next-line max-lines-per-function
const Cron: FC<CronProps> = ({
    locale = DEFAULT_LOCALE_EN,
    value = '',
    setValue,
    onError,
    className,
    defaultPeriod = PeriodType.DAY,
    humanizeLabels = true,
    humanizeValue = false,
    disabled = false,
    readOnly = false,
    leadingZero = false,
    shortcuts = cronShortcuts,
    clockFormat,
}) => {
    const [cronState, cronDispatch] = useReducer(cronReducer, initialCronState);
    const internalValueRef = useRef<string>(value);
    const defaultPeriodRef = useRef<PeriodType>(defaultPeriod);
    const [period, setPeriod] = useState<PeriodType>();
    const [isError, setIsError] = useState<boolean>(false);
    const localeJSON = JSON.stringify(locale);

    useEffect(() => {
        setValuesFromCronString({
            cronString: value,
            setIsError,
            onError,
            internalValueRef,
            firstRender: true,
            locale,
            setPeriod,
            cronDispatch
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (value !== internalValueRef.current) {
            setValuesFromCronString({
                cronString: value,
                setIsError,
                onError,
                internalValueRef,
                firstRender: false,
                locale,
                setPeriod,
                cronDispatch
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, localeJSON, shortcuts]);

    useEffect(() => {
        // Only change the value if a user touched a field
        if (period || Object.values(cronState).some((arr) => arr.length > 0)) {
            const cron = getCronStringFromValues(
                period || defaultPeriodRef.current,
                cronState,
                humanizeValue,
            );

            setValue(cron);
            internalValueRef.current = cron;

            onError && onError(undefined);
            setIsError(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, cronState, humanizeValue]);

    const handleClear = useCallback(() => {
        cronDispatch({
            type: CRON_ACTIONS.CLEAR_ALL,
        });

        period ? setPeriod(period) : setPeriod(defaultPeriodRef.current);

        onError && onError(undefined);
        setIsError(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, setValue, onError]);

    const periodForRender = period || defaultPeriodRef.current;
    const isYearPeriodDisplayed = periodForRender === PeriodType.YEAR;
    const isMonthPeriodDisplayed = isYearPeriodDisplayed || periodForRender === PeriodType.MONTH;
    const isWeekPeriodDisplayed = isMonthPeriodDisplayed || periodForRender === PeriodType.WEEK;
    const isDayPeriodDisplayed = isWeekPeriodDisplayed || periodForRender === PeriodType.DAY;
    const isHourPeriodDisplayed = isDayPeriodDisplayed || periodForRender === PeriodType.HOUR;

    return (
        <CronContainer isError={isError}>
            <Period
                value={periodForRender}
                setValue={setPeriod}
                locale={locale}
                className={className}
                disabled={disabled}
                readOnly={readOnly}
                shortcuts={shortcuts}
            />
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
            </If>
            <If condition={isHourPeriodDisplayed && !readOnly}>
                <ClearButton
                    variant="contained"
                    disabled={disabled}
                    onClick={handleClear}
                >
                    {locale.clearButtonText || DEFAULT_LOCALE_EN.clearButtonText}
                </ClearButton>
            </If>
        </CronContainer>
    );
};

export default Cron;

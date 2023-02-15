import { Dispatch, SetStateAction } from 'react';

import { ButtonProps, SelectProps } from '@mui/material';

export enum PeriodType {
    YEAR = 'year',
    MONTH = 'month',
    WEEK = 'week',
    DAY = 'day',
    HOUR = 'hour',
    MINUTE = 'minute',
    REBOOT = 'reboot',
}

export interface CronProps {
    /**
     * Cron value, the component is by design a controled component.
     * The first value will be the default value.
     *
     * required
     */
    value: string;

    /**
     * Set the cron value, similar to onChange.
     * The naming tells you that you have to set the value by yourself.
     *
     * required
     */
    setValue: SetValue;

    /**
     * Set the container className and used as a prefix for other selectors.
     * Available selectors: https://xrutayisire.github.io/react-js-cron/?path=/story/reactjs-cron--custom-style
     */
    className?: string;

    /**
     * Humanize the labels in the cron component, SUN-SAT and JAN-DEC.
     *
     * Default: true
     */
    humanizeLabels?: boolean;

    /**
     * Humanize the value, SUN-SAT and JAN-DEC.
     *
     * Default: false
     */
    humanizeValue?: boolean;

    /**
     * Add a "0" before numbers lower than 10.
     *
     * Default: false
     */
    leadingZero?: LeadingZero;

    /**
     * Define the default period when the default value is empty.
     *
     * Default: 'day'
     */
    defaultPeriod?: PeriodType;

    /**
     * Disable the cron component.
     *
     * Default: false
     */
    disabled?: boolean;

    /**
     * Make the cron component read-only.
    *
     * Default: false
    */
    readOnly?: boolean;

    /**
     * Define if empty should trigger an error.
    *
    * Default: 'for-default-value'
    */
   allowEmpty?: AllowEmpty;

    /**
     * Support cron shortcuts.
     *
     * Default: ['@yearly', '@annually', '@monthly', '@weekly', '@daily', '@midnight', '@hourly']
     */
    shortcuts?: Shortcuts;
    
    /**
     * Define the clock format.
     */
    clockFormat?: ClockFormat;
    
    /**
     * Display the clear button.
    *
    * Default: true
    */
    clearButton?: boolean;

    clearButtonProps?: ClearButtonProps;
    
    /**
     * Define the clear button action.
    *
     * Default: 'fill-with-every'
     */
    clearButtonAction?: ClearButtonAction;

    /**
     * Display error style (red border and background).
    *
     * Display: true
    */
    displayError?: boolean;

    /**
     * Triggered when the cron component detects an error with the value.
     */
    onError?: OnError;
    
    /**
     * Change the component language.
     * Can also be used to remove prefix and suffix.
     *
     * When setting 'humanizeLabels' you can change the language of the
     * alternative labels with 'altWeekDays' and 'altMonths'.
     *
     * The order of the 'locale' properties 'weekDays', 'months', 'altMonths'
     * and 'altWeekDays' is important! The index will be used as value.
    *
     * Default './locale.ts'
     */
    locale?: Locale;
}
export interface Locale {
    everyText?: string;
    emptyMonths?: string;
    emptyMonthDays?: string;
    emptyMonthDaysShort?: string;
    emptyWeekDays?: string;
    emptyWeekDaysShort?: string;
    emptyHours?: string;
    emptyMinutes?: string;
    emptyMinutesForHourPeriod?: string;
    yearOption?: string;
    monthOption?: string;
    weekOption?: string;
    dayOption?: string;
    hourOption?: string;
    minuteOption?: string;
    rebootOption?: string;
    prefixPeriod?: string;
    prefixMonths?: string;
    prefixMonthDays?: string;
    prefixWeekDays?: string;
    prefixWeekDaysForMonthAndYearPeriod?: string;
    suffixWeekDays?: string;
    prefixHours?: string;
    prefixMinutes?: string;
    prefixMinutesForHourPeriod?: string;
    suffixMinutesForHourPeriod?: string;
    errorInvalidCron?: string;
    clearButtonText?: string;
    weekDays?: string[];
    altWeekDays?: string[];
    nthWeekDays?: string[];
    altNthWeekDays?: string[];
    months?: string[];
    altMonths?: string[];
    nthMonthDays?: string[];
    altNthMonthDays?: string[];
}
export type SetValueFunction = (value: string) => void;
export type SetValue = SetValueFunction | Dispatch<SetStateAction<string>>;
export type CronError =
    | {
        type: 'invalid_cron';
        description: string;
    }
    | undefined;
export type OnErrorFunction = (error: CronError) => void;
export type OnError = OnErrorFunction | Dispatch<SetStateAction<CronError>> | undefined;
export type ClearButtonProps = Omit<ButtonProps, 'onClick'>;
export type ClearButtonAction = 'empty' | 'fill-with-every' | string;
export type AllowEmpty = 'always' | 'never' | 'for-default-value' | string;
export type CronType = 'period' | 'months' | 'month-days' | 'week-days' | 'hours' | 'minutes' | string;
export type LeadingZeroType = 'month-days' | 'hours' | 'minutes' | string;
export type LeadingZero = boolean | LeadingZeroType[];
export type ClockFormat = '24-hour-clock' | '12-hour-clock' | string;
export type ShortcutsType =
    | '@yearly'
    | '@annually'
    | '@monthly'
    | '@weekly'
    | '@daily'
    | '@midnight'
    | '@hourly'
    | '@reboot';
export type Shortcuts = boolean | ShortcutsType[];

// Internal props

export interface CronStateProps {
    months?: number[] | undefined;
    monthDays?: number[] | undefined;
    nthMonthDays?: number[] | undefined;
    day?: number[] | undefined;
    weekDays?: number[] | undefined;
    nthWeekDays?: number[] | undefined;
    hours?: number[] | undefined;
    minutes?: number[] | undefined;
}

export interface CronActionProps {
    type: CRON_ACTIONS,
    payload: { 
        newValue?: number[] | undefined,
        newState?: CronStateProps,
    }
}

export interface FieldProps {
    value?: number[];
    setValue: (newValue: number[]) => void;
    locale: Locale;
    className?: string;
    disabled: boolean;
    readOnly: boolean;
    period: PeriodType;
}

export interface PeriodProps extends Omit<FieldProps, 'value' | 'setValue' | 'period'> {
    value: PeriodType;
    setValue: SetValuePeriod;
    shortcuts: Shortcuts;
}

export interface WeekDaysProps extends FieldProps {
    humanizeLabels: boolean;
    isWeekPeriodDisplayed: boolean;
}

export interface CustomSelectProps
    extends Omit<
    SelectProps,
    | 'mode'
    | 'tokenSeparators'
    | 'allowClear'
    | 'virtual'
    | 'onClick'
    | 'onBlur'
    | 'tagRender'
    | 'dropdownRender'
    | 'showSearch'
    | 'showArrow'
    | 'onChange'
    | 'dropdownMatchSelectWidth'
    | 'options'
    | 'onSelect'
    | 'onDeselect'
    > {
    grid?: boolean;
    setValue: SetValueNumbersOrUndefined;
    optionsList?: string[];
    locale: Locale;
    value?: number[];
    humanizeLabels?: boolean;
    disabled: boolean;
    readOnly: boolean;
    leadingZero?: LeadingZero;
    clockFormat?: ClockFormat;
    period: PeriodType;
    unit: Unit;
    isMultiple?: boolean;
}

export type SetValueNumbersOrUndefined = Dispatch<SetStateAction<number[] | undefined>>;
export type SetValuePeriod = Dispatch<SetStateAction<PeriodType>>;
export type SetInternalError = Dispatch<SetStateAction<boolean>>;

export interface DefaultLocale {
    everyText: string;
    emptyMonths: string;
    emptyMonthDays: string;
    emptyMonthDaysShort: string;
    emptyWeekDays: string;
    emptyWeekDaysShort: string;
    emptyHours: string;
    emptyMinutes: string;
    emptyMinutesForHourPeriod: string;
    yearOption: string;
    monthOption: string;
    weekOption: string;
    dayOption: string;
    hourOption: string;
    minuteOption: string;
    rebootOption: string;
    prefixPeriod: string;
    prefixMonths: string;
    prefixMonthDays: string;
    prefixWeekDays: string;
    prefixWeekDaysForMonthAndYearPeriod: string;
    suffixWeekDays: string;
    prefixHours: string;
    prefixMinutes: string;
    prefixMinutesForHourPeriod: string;
    suffixMinutesForHourPeriod: string;
    errorInvalidCron: string;
    clearButtonText: string;
    weekDays: string[];
    nthWeekDays?: string[];
    months: string[];
    nthMonthDays?: string[];
    altNthMonthDays?: string[];
    altWeekDays?: string[];
    altNthWeekDays?: string[];
    altMonths: string[];
}
export type CronValues = { [key in CronType]: number[] | string | undefined };
export interface Classes {
    [key: string]: boolean;
}
export interface ShortcutsValues {
    name: ShortcutsType;
    value: string;
}
export interface Unit {
    type: CronType;
    min: number;
    max: number;
    total: number;
    alt?: string[];
}
export interface Clicks {
    time: number;
    value: number;
}

export interface cronObjProps {
    newMinutes: number[],
    newHours: number[],
    newMonthDays: number[],
    newNthMonthDays?: number[],
    newMonths: number[],
    newWeekDays: number[],
    newNthWeekDays?: number[],
}

export enum CRON_ACTIONS {
    SET_ALL = 'set-all',
    SET_EACH = 'set-each',
    SET_MONTHS = 'set-months',
    SET_MONTH_DAYS = 'set-month-days',
    SET_NTH_MONTH_DAYS = 'set-nth-month-days',
    SET_WEEK_DAYS = 'set-week-days',
    SET_NTH_WEEK_DAYS = 'set-nth-week-days',
    SET_HOURS = 'set-hours',
    SET_MINUTES = 'set-minutes',
}

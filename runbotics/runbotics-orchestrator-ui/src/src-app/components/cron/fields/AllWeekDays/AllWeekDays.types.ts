import { PeriodTypes, Locale } from '../../types';

export interface AllWeekDaysProps {
    locale: Locale;
    humanizeLabels: boolean;
    disabled: boolean;
    readOnly: boolean;
    periodForRender: PeriodTypes;
    weekDays: number[];
    setWeekDays: (weekDays: number[]) => void;
    nthWeekDays: number[];
    setNthWeekDays: (nthWeekDays: number[]) => void;
    isMonthPeriodDisplayed: boolean;
    isWeekPeriodDisplayed: boolean;
}

import { PeriodType, Locale } from '../../types';

export interface WeekDaysSectionProps {
    locale: Locale;
    humanizeLabels: boolean;
    disabled: boolean;
    readOnly: boolean;
    periodForRender: PeriodType;
    weekDays: number[];
    setWeekDays: (weekDays: number[]) => void;
    nthWeekDays: number[];
    setNthWeekDays: (nthWeekDays: number[]) => void;
    isMonthPeriodDisplayed: boolean;
}

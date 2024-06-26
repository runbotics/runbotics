import { translate } from '#src-app/hooks/useTranslations';

import { DefaultLocale } from './types';

const DEFAULT_LOCALE_EN: DefaultLocale = {
    everyText: translate('Component.Cron.Locale.Every'),
    emptyMonths: translate('Component.Cron.Locale.EveryMonth'),
    emptyMonthDays: translate('Component.Cron.Locale.EveryDayOfMonth'),
    emptyMonthDaysShort: translate('Component.Cron.Locale.EmptyMonthDaysShort'),
    emptyWeekDays: translate('Component.Cron.Locale.EmptyWeekDays'),
    emptyWeekDaysShort: translate('Component.Cron.Locale.EmptyWeekDaysShort'),
    emptyHours: translate('Component.Cron.Locale.EmptyHours'),
    emptyMinutes: translate('Component.Cron.Locale.EmptyMinutes'),
    emptyMinutesForHourPeriod: translate('Component.Cron.Locale.EmptyMinutesForHourPeriod'),
    yearOption: translate('Component.Cron.Locale.YearOption'),
    monthOption: translate('Component.Cron.Locale.MonthOption'),
    weekOption: translate('Component.Cron.Locale.WeekOption'),
    dayOption: translate('Component.Cron.Locale.DayOption'),
    hourOption: translate('Component.Cron.Locale.HourOption'),
    minuteOption: translate('Component.Cron.Locale.MinuteOption'),
    rebootOption: translate('Component.Cron.Locale.RebootOption'),
    prefixPeriod: translate('Component.Cron.Locale.PrefixPeriod'),
    prefixMonths: translate('Component.Cron.Locale.PrefixMonths'),
    prefixMonthDays: translate('Component.Cron.Locale.PrefixMonthDays'),
    prefixWeekDays: translate('Component.Cron.Locale.PrefixWeekDays'),
    prefixWeekDaysForMonthAndYearPeriod: translate('Component.Cron.Locale.PrefixWeekDaysForMonthAndYearPeriod'),
    suffixWeekDays: translate('Component.Cron.Locale.SuffixWeekDays'),
    prefixHours: translate('Component.Cron.Locale.PrefixHours'),
    prefixMinutes: translate('Component.Cron.Locale.PrefixMinutes'),
    prefixMinutesForHourPeriod: translate('Component.Cron.Locale.PrefixMinutesForHourPeriod'),
    suffixMinutesForHourPeriod: translate('Component.Cron.Locale.SuffixMinutesForHourPeriod'),
    errorInvalidCron: translate('Component.Cron.Locale.ErrorInvalidCron'),
    clearButtonText: translate('Common.Clear'),
    // In each of the arrays below order is important, the index will be used as value
    weekDays: [
        translate('Component.Cron.Locale.WeekDays.Sunday'), // Sunday must always be first, it's "0"
        translate('Component.Cron.Locale.WeekDays.Monday'),
        translate('Component.Cron.Locale.WeekDays.Tuesday'),
        translate('Component.Cron.Locale.WeekDays.Wednesday'),
        translate('Component.Cron.Locale.WeekDays.Thursday'),
        translate('Component.Cron.Locale.WeekDays.Friday'),
        translate('Component.Cron.Locale.WeekDays.Saturday'),
    ],
    nthWeekDays: [
        translate('Component.Cron.Locale.NthWeekDays.First'),
        translate('Component.Cron.Locale.NthWeekDays.Second'),
        translate('Component.Cron.Locale.NthWeekDays.Third'),
        translate('Component.Cron.Locale.NthWeekDays.Fourth'),
        translate('Component.Cron.Locale.NthWeekDays.Last'),
    ],
    months: [
        translate('Component.Cron.Locale.Months.January'),
        translate('Component.Cron.Locale.Months.February'),
        translate('Component.Cron.Locale.Months.March'),
        translate('Component.Cron.Locale.Months.April'),
        translate('Component.Cron.Locale.Months.May'),
        translate('Component.Cron.Locale.Months.June'),
        translate('Component.Cron.Locale.Months.July'),
        translate('Component.Cron.Locale.Months.August'),
        translate('Component.Cron.Locale.Months.September'),
        translate('Component.Cron.Locale.Months.October'),
        translate('Component.Cron.Locale.Months.November'),
        translate('Component.Cron.Locale.Months.December'),
    ],
    nthMonthDays: [
        translate('Component.Cron.Locale.MonthDays.Last'),
        // translate('Component.Cron.Locale.MonthDays.LastWeekday'), // bull depends on cron-parser which doesn't support this yet
    ],
    altNthMonthDays: [
        translate('Component.Cron.Locale.AltMonthDays.Last'),
        // translate('Component.Cron.Locale.AltMonthDays.LastWeekday'), // bull depends on cron-parser which doesn't support this yet
    ],
    altWeekDays: [
        translate('Component.Cron.Locale.AltWeekDays.Sunday'), // Sunday must always be first, it's "0"
        translate('Component.Cron.Locale.AltWeekDays.Monday'),
        translate('Component.Cron.Locale.AltWeekDays.Tuesday'),
        translate('Component.Cron.Locale.AltWeekDays.Wednesday'),
        translate('Component.Cron.Locale.AltWeekDays.Thursday'),
        translate('Component.Cron.Locale.AltWeekDays.Friday'),
        translate('Component.Cron.Locale.AltWeekDays.Saturday'),
    ], 
    altMonths: [
        translate('Component.Cron.Locale.AltMonths.January'),
        translate('Component.Cron.Locale.AltMonths.February'),
        translate('Component.Cron.Locale.AltMonths.March'),
        translate('Component.Cron.Locale.AltMonths.April'),
        translate('Component.Cron.Locale.AltMonths.May'),
        translate('Component.Cron.Locale.AltMonths.June'),
        translate('Component.Cron.Locale.AltMonths.July'),
        translate('Component.Cron.Locale.AltMonths.August'),
        translate('Component.Cron.Locale.AltMonths.September'),
        translate('Component.Cron.Locale.AltMonths.October'),
        translate('Component.Cron.Locale.AltMonths.November'),
        translate('Component.Cron.Locale.AltMonths.December'),
    ],
    altNthWeekDays: [
        translate('Component.Cron.Locale.AltNthWeekDays.First'),
        translate('Component.Cron.Locale.AltNthWeekDays.Second'),
        translate('Component.Cron.Locale.AltNthWeekDays.Third'),
        translate('Component.Cron.Locale.AltNthWeekDays.Fourth'),
        translate('Component.Cron.Locale.AltNthWeekDays.Last'),
    ],
};

export default DEFAULT_LOCALE_EN;

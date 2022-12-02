import useTranslations from '#src-app/hooks/useTranslations';

import { DefaultLocale } from './types';

export const useCurrentLocale = (): DefaultLocale => {
    const { translate } = useTranslations();

    return {
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
        prefixHours: translate('Component.Cron.Locale.PrefixHours'),
        prefixMinutes: translate('Component.Cron.Locale.PrefixMinutes'),
        prefixMinutesForHourPeriod: translate('Component.Cron.Locale.PrefixMinutesForHourPeriod'),
        suffixMinutesForHourPeriod: translate('Component.Cron.Locale.SuffixMinutesForHourPeriod'),
        errorInvalidCron: translate('Component.Cron.Locale.ErrorInvalidCron'),
        clearButtonText: translate('Common.Clear'),
        weekDays: [
            // Order is important, the index will be used as value
            translate('Component.Cron.Locale.WeekDays.Sunday'), // Sunday must always be first, it's "0"
            translate('Component.Cron.Locale.WeekDays.Monday'),
            translate('Component.Cron.Locale.WeekDays.Tuesday'),
            translate('Component.Cron.Locale.WeekDays.Wednesday'),
            translate('Component.Cron.Locale.WeekDays.Thursday'),
            translate('Component.Cron.Locale.WeekDays.Friday'),
            translate('Component.Cron.Locale.WeekDays.Saturday'),
        ],
        months: [
            // Order is important, the index will be used as value
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
        // Order is important, the index will be used as value
        altWeekDays: [
            translate('Component.Cron.Locale.AltWeekDays.Sunday'), // Sunday must always be first, it's "0"
            translate('Component.Cron.Locale.AltWeekDays.Monday'),
            translate('Component.Cron.Locale.AltWeekDays.Tuesday'),
            translate('Component.Cron.Locale.AltWeekDays.Wednesday'),
            translate('Component.Cron.Locale.AltWeekDays.Thursday'),
            translate('Component.Cron.Locale.AltWeekDays.Friday'),
            translate('Component.Cron.Locale.AltWeekDays.Saturday'),
        ],
        // Order is important, the index will be used as value
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
    };
};

const defaultDateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

const DEFAULT_DATE_FORMAT_LOCALE = 'en-US';

export const dateFormat = (
    date: string,
    locale = DEFAULT_DATE_FORMAT_LOCALE,
    formatOptions = defaultDateFormatOptions
) => new Intl.DateTimeFormat(locale, formatOptions).format(new Date(date));

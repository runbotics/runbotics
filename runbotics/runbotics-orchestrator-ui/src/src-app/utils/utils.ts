import moment from 'moment';

import { translate } from '#src-app/hooks/useTranslations';

export const formatDate = (date: string | Date) => moment(date).format('YYYY-MM-DD HH:mm:ss.SS');

export const formatTimeDiff = (fromDate: string | Date, toDate: string | Date) => {
    const duration = moment.duration(moment(toDate).diff(moment(fromDate)));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const miliseconds = duration.milliseconds();

    let durationText = '';

    if (hours) { durationText = `${hours}${translate('Common.Time.Hours.Short')} `; }

    if (minutes) { durationText = `${durationText} ${minutes}${translate('Common.Time.Minutes.Short')} `; }

    if (seconds) { durationText = `${durationText} ${seconds}${translate('Common.Time.Seconds.Short')} `; }

    if (miliseconds) { durationText = `${durationText} ${miliseconds}${translate('Common.Time.Miliseconds.Short')}`; }


    return durationText;
};

export function isJsonValid(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

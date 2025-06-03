import { addDays, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';

export const isExpired = (expDateStr?: string): boolean => {
    if (!expDateStr) return false;
    const expDate = parseISO(expDateStr);
    const today = new Date();
    return isBefore(expDate, today) && !isSameDay(expDate, today);
};

export const isExpiringSoon = (expDateStr?: string): boolean => {
    if (!expDateStr) return false;
    const expDate = parseISO(expDateStr);
    const today = new Date();
    const expPeriod = addDays(today, 14);
    return (isAfter(expDate, today) || isSameDay(expDate, today)) &&
        (isBefore(expDate, expPeriod) || isSameDay(expDate, expPeriod));
};

import { formatDistanceToNow } from 'date-fns';

export const formatDistanceToNowMapper = (date: string | number | Date) => {
    if (typeof date === 'string') {
        return `${formatDistanceToNow(new Date(date))} ago`;
    }
    return `${formatDistanceToNow(date)} ago`;
};

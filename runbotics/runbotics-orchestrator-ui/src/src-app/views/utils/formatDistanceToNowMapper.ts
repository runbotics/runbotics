import { formatDistanceToNow } from 'date-fns';

type DistanceToNowOptions = Parameters<typeof formatDistanceToNow>[1];

export const formatDistanceToNowMapper = (date: string | number | Date) => {
    const options: DistanceToNowOptions = {
        addSuffix: true,
        includeSeconds: true,
    };
    if (typeof date === 'string') {
        return formatDistanceToNow(new Date(date), options);
    }
    return formatDistanceToNow(date, options);
};

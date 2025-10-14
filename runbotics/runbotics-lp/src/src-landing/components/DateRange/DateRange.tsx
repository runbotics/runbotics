import {
    ChangeEvent, VFC, useEffect, useState
} from 'react';

import styles from './DateRange.module.scss';

export interface IDateRange {
    startDate: string;
    endDate: string;
}

interface Props {
    onChange: (dateRange: IDateRange) => void;
    initialDateRange?: Partial<IDateRange>;
}

const DateRange: VFC<Props> = ({ initialDateRange, onChange }) => {
    const [startDate, setStartDate] = useState<string>(initialDateRange?.startDate ?? '');
    const [endDate, setEndDate] = useState<string>(initialDateRange?.endDate ?? '');

    const today = new Date().toISOString().split('T')[0];

    const furthestDate = endDate && new Date(today) > new Date(endDate) ? endDate : today;

    useEffect(() => {
        setStartDate(initialDateRange?.startDate ?? '');
        setEndDate(initialDateRange?.endDate ?? '');
    }, [initialDateRange]);

    const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
        onChange({
            startDate: event.target.value,
            endDate,
        });
    };

    const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (new Date(event.target.value) > new Date(today)) return;

        let newStartDate = startDate;

        if (startDate && new Date(startDate) > new Date(event.target.value)) {
            setStartDate(event.target.value);
            newStartDate = event.target.value;
        }

        setEndDate(event.target.value);
        onChange({
            startDate: newStartDate,
            endDate: event.target.value,
        });
    };

    return (
        <div className={styles.wrapper}>
            <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                max={furthestDate}
            />
            <div className={styles.divider} />
            <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                max={today}
            />
        </div>
    );
};

export default DateRange;

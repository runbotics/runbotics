import { useCallback, useEffect, useRef, useState } from 'react';

export const useTimer = (initialRemainingTime: number, callback?: () => void) => {
    const [remainingTime, setRemainingTime] = useState(initialRemainingTime);
    const interval = useRef(null);

    const calculate = useCallback(() => {
        const hours = Math.floor(remainingTime / 3600)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((remainingTime / 60) % 60)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor(remainingTime % 60)
            .toString()
            .padStart(2, '0');

        return { hours, minutes, seconds };
    }, [remainingTime]);

    useEffect(() => {
        setRemainingTime(initialRemainingTime);
    }, [initialRemainingTime]);

    useEffect(() => {
        interval.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                }

                clearInterval(interval.current);
                typeof callback === 'function' && callback();
                return 0;
            });
        }, 1000);

        return () => clearInterval(interval.current);
    }, []);

    return calculate();
};

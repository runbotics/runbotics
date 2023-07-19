import { FC } from 'react';

import { useTimer } from '#src-app/hooks/useTimer';

const CountdownTimer: FC<{ remainingTime: number, callback?: () => void }> = ({ remainingTime, callback }) => {
    const { hours, minutes, seconds } = useTimer(remainingTime, callback);

    return <span>{`${hours} : ${minutes} : ${seconds}`}</span>;
};

export default CountdownTimer;

import { FC } from 'react';

import CaruselButton from '#src-landing/components/CaruselButton';
import Typography from '#src-landing/components/Typography';

import styles from './MobileCaruselNav.module.scss';
import { MobileCaruselNavProps } from './MobileCaruselNav.types';

const MobileCaruselNav: FC<MobileCaruselNavProps> = ({
    decrementSlide,
    incrementSlide,
    length,
    currentSlide,
}) => (
    <div className={styles.root}>
        <CaruselButton direction="backward" onClick={decrementSlide} />
        <Typography variant="body1" className={styles.counter}>
            <span className={styles.counterCurrent}>{currentSlide + 1}</span>
            /&nbsp;{length}
        </Typography>
        <CaruselButton direction="forward" onClick={incrementSlide} />
    </div>
);

export default MobileCaruselNav;

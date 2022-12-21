import { FC } from 'react';

import CarouselButton from '#src-landing/components/CarouselButton';
import Typography from '#src-landing/components/Typography';

import styles from './MobileCarouselNav.module.scss';
import { MobileCarouselNavProps } from './MobileCarouselNav.types';

const MobileCarouselNav: FC<MobileCarouselNavProps> = ({
    decrementSlide,
    incrementSlide,
    length,
    currentSlide,
    className,
}) => (
    <div className={`${styles.root} ${className ?? ''}`}>
        <CarouselButton direction="backward" onClick={decrementSlide} />
        {currentSlide !== null ? (
            <Typography variant="body1" className={styles.counter}>
                <span className={styles.counterCurrent}>
                    {currentSlide + 1}
                </span>
                /&nbsp;{length}
            </Typography>
        ) : null}
        <CarouselButton direction="forward" onClick={incrementSlide} />
    </div>
);

export default MobileCarouselNav;

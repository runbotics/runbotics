import { FC } from 'react';

import CarouselButton from '#src-landing/components/Carousel/CarouselButton';
import Typography from '#src-landing/components/Typography';

import styles from './MobileCarouselNav.module.scss';
import { MobileCarouselNavProps } from './MobileCarouselNav.types';

const MobileCarouselNav: FC<MobileCarouselNavProps> = ({
    decrementSlide,
    incrementSlide,
    length,
    currentSlide,
    className = '',
    isFirstSlide,
    isLastSlide,
}) => {
    const hasCounter = currentSlide !== null;
    return (
        <div className={`${styles.root} ${className}`}>
            <CarouselButton
                direction="backward"
                onClick={decrementSlide}
                visible={!isFirstSlide}
            />
            {hasCounter ? (
                <Typography variant="body1" className={styles.counter}>
                    <span className={styles.counterCurrent}>
                        {currentSlide + 1}
                    </span>
                    /&nbsp;{length}
                </Typography>
            ) : null}
            <CarouselButton
                direction="forward"
                onClick={incrementSlide}
                visible={!isLastSlide}
            />
        </div>
    );
};

export default MobileCarouselNav;

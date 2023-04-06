import { FC, useState } from 'react';

import CarouselButton from '#src-landing/components/Carousel/CarouselButton';
import MobileCarouselNav from '#src-landing/components/Carousel/MobileCarouselNav';
import Typography from '#src-landing/components/Typography';

import styles from './Carousel.module.scss';
import { CarouselProps } from './Carousel.types';

const Carousel: FC<CarouselProps> = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const incrementSlide = () => {
        if (currentSlide === slides.length - 1) {
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const decrementSlide = () => {
        if (currentSlide === 0) {
            setCurrentSlide(slides.length - 1);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.buttonWrapper}>
                <CarouselButton direction="backward" onClick={decrementSlide} />
            </div>
            <div className={styles.contentWrapper}>
                {slides[currentSlide].content}
            </div>
            <div className={styles.buttonWrapper}>
                <CarouselButton direction="forward" onClick={incrementSlide} />
                <Typography variant="body1" className={styles.counter}>
                    <span className={styles.counterCurrent}>
                        {currentSlide + 1}
                    </span>
                    /&nbsp;
                    {slides.length}
                </Typography>
            </div>
            <MobileCarouselNav
                currentSlide={currentSlide}
                decrementSlide={decrementSlide}
                incrementSlide={incrementSlide}
                length={slides.length}
            />
        </div>
    );
};

export default Carousel;

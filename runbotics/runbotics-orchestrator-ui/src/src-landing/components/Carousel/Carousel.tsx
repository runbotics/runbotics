import { FC, useState, useRef, useEffect } from 'react';

import If from '#src-app/components/utils/If';
import CarouselButton from '#src-landing/components/Carousel/CarouselButton';
import MobileCarouselNav from '#src-landing/components/Carousel/MobileCarouselNav';
import Typography from '#src-landing/components/Typography';

import defaultStyles from './Carousel.module.scss';
import { CarouselProps } from './Carousel.types';

const Carousel: FC<CarouselProps> = ({ slides, subsetSize = 1, customStyles, hasCSSSlider, hasCounter, hideControlsOnEdge }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [sliderWidth, setSliderWidth] = useState<null | number>(subsetSize);
    const isLastSlide = hideControlsOnEdge && slides.length - sliderWidth === activeIndex; // - subsetSize 
    const isFirstSlide = hideControlsOnEdge && activeIndex === 0;
    const sliderRef = useRef<HTMLDivElement>(null);
    const styles = customStyles ?? defaultStyles;

    useEffect(() => {
        if (hasCSSSlider && sliderRef.current) {
            setSliderWidth(
                parseInt(
                    getComputedStyle(sliderRef.current).getPropertyValue(
                        '--items-per-slider'
                    )
                )
            );
            sliderRef.current.style.setProperty(
                '--index',
                activeIndex.toString()
            );
        }
    }, [sliderRef, activeIndex, hasCSSSlider]);

    const handleForward = () => {
        setActiveIndex((prevIndex) => 
            (prevIndex + 1) % slides.length
        );
    };

    const handleBackward = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };


    return (
        <div className={styles.root}>
            <div className={styles.buttonWrapper}>
                <CarouselButton 
                    direction="backward" 
                    onClick={handleBackward} 
                    visible={!isFirstSlide} />
            </div>
            <div className={styles.contentWrapper}>
                <If condition={hasCSSSlider} else={slides.slice(activeIndex, activeIndex + sliderWidth)}>
                    <div className={styles.slider} ref={sliderRef}>
                        {slides}
                    </div>
                </If>
            </div>
            <div className={styles.buttonWrapper}>
                <CarouselButton 
                    direction="forward" 
                    onClick={handleForward} 
                    visible={!isLastSlide}
                />
                <If condition={hasCounter}>
                    <Typography variant="body1" className={styles.counter}>
                        <span className={styles.counterCurrent}>
                            {activeIndex + 1}
                        </span>
                        /&nbsp;
                        {slides.length}
                    </Typography>
                </If>
            </div>
            <MobileCarouselNav
                className={styles.mobileNav}
                currentSlide={hasCounter ? activeIndex : null}
                incrementSlide={handleForward}
                decrementSlide={handleBackward}
                isFirstSlide={isFirstSlide}
                isLastSlide={isLastSlide}
                length={slides.length}
            />
        </div>
    );
};

export default Carousel;

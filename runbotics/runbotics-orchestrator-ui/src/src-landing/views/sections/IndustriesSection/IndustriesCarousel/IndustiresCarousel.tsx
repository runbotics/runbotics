import { FC, useEffect, useRef, useState } from 'react';

import CarouselButton from '#src-landing/components/CarouselButton';

import IndustriesSlide from '#src-landing/views/sections/IndustriesSection/IndustriesSlide/IndustriesSlide';

import MobileCarouselNav from '../../../../components/MobileCarouselNav';
import { IndustriesCarouselProps } from './IndustiresCarousel.types';
import styles from './IndustriesCarousel.module.scss';

const IndustriesCarousel: FC<IndustriesCarouselProps> = ({ slides }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [openSlide, setOpenSlide] = useState<null | number>(null);
    const [sliderWidth, setSliderWidth] = useState<null | number>(null);

    const sliderRef = useRef<HTMLDivElement>(null);

    const handleForward = () => {
        setActiveIndex((prev) =>
            prev === slides.length - sliderWidth ? 0 : prev + 1
        );
    };

    const handleBackward = () => {
        setActiveIndex((prev) =>
            prev === 0 ? slides.length - sliderWidth : prev - 1
        );
    };

    const toggleSlide = (index: number) => {
        setOpenSlide((prev) => (prev === index ? null : index));
    };

    useEffect(() => {
        if (sliderRef.current) {
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
    }, [sliderRef, activeIndex]);

    return (
        <div className={styles.root}>
            <div className={styles.buttonContainer}>
                <CarouselButton direction="backward" onClick={handleBackward} />
            </div>
            <div className={styles.container}>
                <div className={styles.slider} ref={sliderRef}>
                    {slides.map((slide, index) => (
                        <IndustriesSlide
                            key={slide.titleKey}
                            index={index}
                            openSlide={openSlide}
                            toggleSlide={toggleSlide}
                            activeIndex={activeIndex}
                            sliderWidth={sliderWidth}
                            slide={slide}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <CarouselButton direction="forward" onClick={handleForward} />
            </div>
            <MobileCarouselNav
                incrementSlide={handleForward}
                decrementSlide={handleBackward}
                currentSlide={null}
                className={styles.mobileNav}
            />
        </div>
    );
};
export default IndustriesCarousel;

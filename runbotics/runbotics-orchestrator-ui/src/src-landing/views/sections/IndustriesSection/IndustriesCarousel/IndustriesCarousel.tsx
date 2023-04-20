import { useState } from 'react';

import Carousel from '#src-landing/components/Carousel/Carousel';

import { INDUSTRIES_SLIDES } from '#src-landing/views/sections/IndustriesSection/IndustriesSection.utils';
import IndustriesSlide from '#src-landing/views/sections/IndustriesSection/IndustriesSlide';

import styles from './IndustriesCarousel.module.scss';

const IndustriesCarousel = () => {
    const [openSlide, setOpenSlide] = useState<null | number>(null);

    const toggleSlide = (index: number) => {
        setOpenSlide((prevIndex) => (prevIndex === index ? null : index));
    };

    const slides = INDUSTRIES_SLIDES.map((slide, index) => (
        <IndustriesSlide
            key={slide.titleKey}
            index={index}
            openSlide={openSlide}
            toggleSlide={toggleSlide}
            slide={slide}
        />
    ));

    return (<Carousel slides={slides} customStyles={styles} hasCSSSlider hideControlsOnEdge />);
};

export default IndustriesCarousel;

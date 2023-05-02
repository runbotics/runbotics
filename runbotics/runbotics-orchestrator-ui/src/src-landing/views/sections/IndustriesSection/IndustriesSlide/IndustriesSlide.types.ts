import { IndustrySlide } from '../IndustriesSection.types';

export interface IsVisibleProps {
    slideIndex: number;
    activeIndex: number;
    sliderWidth: number;
}

export interface IndustriesSlideProps {
    index: number;
    openSlide: number;
    toggleSlide: (idx: number) => void;
    activeIndex?: number;
    sliderWidth?: number;
    slide: IndustrySlide;
}

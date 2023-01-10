import { IsVisibleProps } from './IndustriesSlide.types';

export const isVisible = ({
    slideIndex,
    activeIndex,
    sliderWidth,
}: IsVisibleProps) => {
    const visibleSlides = Array.from(
        { length: sliderWidth },
        (_, i) => i + activeIndex
    );
    return visibleSlides.includes(slideIndex).toString();
};

export interface MobileCarouselNavProps {
    decrementSlide: () => void;
    incrementSlide: () => void;
    length?: number;
    currentSlide?: number;
    className?: string;
    isLastSlide?: boolean;
    isFirstSlide?: boolean;
}

export interface CarouselStyles {
    [key: string]: string;
}

export interface CarouselProps {
    slides: JSX.Element[];
    subsetSize?: number;
    styles?: CarouselStyles;
    useCSSSlider?: boolean;
    hasCounter?: boolean;
    hideControlsOnEdge?: boolean;
}

export interface CarouselStyles {
    [key: string]: string;
}

export interface CarouselProps {
    slides: JSX.Element[];
    itemsPerSlider?: number;
    customStyles?: CarouselStyles;
    hasCSSSlider?: boolean; // gives the opportunity to control slider from css
    hasCounter?: boolean;
    hideControlsOnEdge?: boolean;
}

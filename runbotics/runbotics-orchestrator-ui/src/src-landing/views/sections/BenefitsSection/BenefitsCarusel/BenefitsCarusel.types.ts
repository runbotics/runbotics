
type SlideTitleKey = 'Landing.Benefits.Slides.Repetitive.Title'
    | 'Landing.Benefits.Slides.Efficiency.Title'
    | 'Landing.Benefits.Slides.Accuracy.Title';

type SlideDescriptionKey = 'Landing.Benefits.Slides.Repetitive.Description'
    | 'Landing.Benefits.Slides.Efficiency.Description'
    | 'Landing.Benefits.Slides.Accuracy.Description';

export interface Slide {
    titleKey: SlideTitleKey;
    descriptionKey: SlideDescriptionKey;
    imageSrc: string;
    imageAlt: string;
};

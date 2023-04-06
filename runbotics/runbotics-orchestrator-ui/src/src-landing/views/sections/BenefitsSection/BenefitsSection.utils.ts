import { Article } from './BenefitsArticle/BenefitsArticle.types';

export const BENEFITS_TITLE_ID = 'benefits-title';

export const BENEFITS_ARTICLES: Article[] = [
    {
        descriptionKey: 'Landing.Benefits.Slides.Repetitive.Description',
        imageSrc: '/images/shapes/beach_access.svg',
        imageAlt: 'beach icon',
        titleKey: 'Landing.Benefits.Slides.Repetitive.Title',
    },
    {
        descriptionKey: 'Landing.Benefits.Slides.Efficiency.Description',
        imageSrc: '/images/shapes/hourglass.svg',
        imageAlt: 'Hourglass icon',
        titleKey: 'Landing.Benefits.Slides.Efficiency.Title',
    },
    {
        descriptionKey: 'Landing.Benefits.Slides.Accuracy.Description',
        imageSrc: '/images/shapes/layers.svg',
        imageAlt: 'Layers icon',
        titleKey: 'Landing.Benefits.Slides.Accuracy.Title',
    },
];

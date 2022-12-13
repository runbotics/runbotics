import benefitsTranslation from '#src-landing/translations/en/benefits.json';

type SlideTranslationKey = keyof typeof benefitsTranslation;

export interface Slide {
    titleKey: SlideTranslationKey;
    descriptionKey: SlideTranslationKey;
    imageSrc: string;
    imageAlt: string;
};

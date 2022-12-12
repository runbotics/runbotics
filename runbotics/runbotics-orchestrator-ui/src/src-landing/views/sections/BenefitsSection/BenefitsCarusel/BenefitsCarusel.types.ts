import { TranslationsDescriptors } from '#src-app/translations/translations';

export interface Slide {
    titleKey: keyof TranslationsDescriptors;
    descriptionKey: keyof TranslationsDescriptors;
    imageSrc: string;
    imageAlt: string;
};

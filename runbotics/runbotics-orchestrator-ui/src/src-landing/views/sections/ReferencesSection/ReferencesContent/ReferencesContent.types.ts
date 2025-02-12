import { StaticImageData } from 'next/image';

import referencesTranslation from '#src-landing/translations/en/landing/references.json';

type ArticleTranslationKey = keyof typeof referencesTranslation;

export interface Reference {
    id: string,
    quotes: ArticleTranslationKey[];
    authorName?: ArticleTranslationKey;
    authorTitle?: ArticleTranslationKey;
    authorImage?: StaticImageData;
    logo: StaticImageData;
    caseStudyLink: string;
}

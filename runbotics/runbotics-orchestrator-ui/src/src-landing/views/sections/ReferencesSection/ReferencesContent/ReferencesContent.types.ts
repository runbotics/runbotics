import { StaticImageData } from 'next/image';

import referencesTranslation from '#src-landing/translations/en/landing/references.json';

type ArticleTranslationKey = keyof typeof referencesTranslation;

export interface Reference {
    id: string,
    quote1: ArticleTranslationKey;
    quote2?: ArticleTranslationKey;
    quote3?: ArticleTranslationKey;
    authorName?: ArticleTranslationKey;
    authorTitle?: ArticleTranslationKey;
    authorImage?: StaticImageData;
    logo: StaticImageData;
    caseStudyLink: string;
}

import { StaticImageData } from 'next/image';

import referencesTranslation from '#src-landing/translations/en/landing/references.json';

type ArticleTranslationKey = keyof typeof referencesTranslation;

export interface AuthorData {
    authorName?: ArticleTranslationKey;
    authorTitle?: ArticleTranslationKey;
    authorImage?: StaticImageData;
}

export interface Reference extends AuthorData {
    id: string;
    quotes: ArticleTranslationKey[];
    logo: StaticImageData;
    caseStudyLink: string;
}
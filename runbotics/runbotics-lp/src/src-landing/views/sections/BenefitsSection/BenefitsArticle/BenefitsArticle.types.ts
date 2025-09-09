import benefitsTranslation from '#src-landing/translations/en/landing/benefits.json';

type ArticleTranslationKey = keyof typeof benefitsTranslation;

export interface Article {
    titleKey: ArticleTranslationKey;
    descriptionKey: ArticleTranslationKey;
    imageSrc: string;
    imageAlt: string;
}

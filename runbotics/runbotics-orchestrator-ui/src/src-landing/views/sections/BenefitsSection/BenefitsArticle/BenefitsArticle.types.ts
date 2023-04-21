import benefitsTranslation from '#src-landing/translations/en/benefits.json';

type ArticleTranslationKey = keyof typeof benefitsTranslation;

export interface Article {
    titleKey: ArticleTranslationKey;
    descriptionKey: ArticleTranslationKey;
    imageSrc: string;
    imageAlt: string;
}

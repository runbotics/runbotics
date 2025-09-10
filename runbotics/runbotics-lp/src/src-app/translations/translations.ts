import englishTranslations from './en';
import polishTranslations from './pl';

export const languages = ['en', 'pl'] as const;

export const DEFAULT_LANG = 'en';

export type Language = (typeof languages)[number];

export type TranslationsDescriptors = typeof englishTranslations;

const translations: Record<Language, { translation: TranslationsDescriptors }> = {
    en: {
        translation: englishTranslations,
    },
    pl: {
        translation: polishTranslations,
    },
};

export default translations;

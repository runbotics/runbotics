import config from '../../../config.json';
import englishTranslations from './en';
import polishTranslations from './pl';


export const languages = [...config.languages] as const;

export const DEFAULT_LANG = config.DEFAULT_LANG;

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

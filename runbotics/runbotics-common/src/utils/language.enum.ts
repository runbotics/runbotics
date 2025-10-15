export enum Language {
    EN = 'en',
    PL = 'pl'
}

export type SupportedLanguage = Language.EN | Language.PL;

export const DEFAULT_LANGUAGE = Language.EN;
import React from 'react';

import { sanitize } from 'dompurify';
import i18next from 'i18next';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { TranslationsDescriptors, Language } from '../translations/translations';

const useTranslations = () => {
    const { t, i18n } = useTranslation();

    const translate = (
        key: keyof TranslationsDescriptors,
        values?: { [key: string]: string | number },
    ) => t(key, values);

    const translateHTML = (
        key: keyof TranslationsDescriptors,
        values?: { [key: string]: string | number },
    ) => {
        const translation = translate(key, values);

        return translation && <span dangerouslySetInnerHTML={{ __html: sanitize(translation) }} />;
    };

    const switchLanguage = (lang: Language) => {
        i18n.changeLanguage(lang);
        moment.locale(lang);
    };

    const currentLanguage = i18n.language;

    return {
        translate,
        translateHTML,
        switchLanguage,
        currentLanguage,
    };
};

export const isNamespaceLoaded = () => new Promise((resolve) => {
    if (i18next.hasLoadedNamespace(i18next.language)) {
        resolve(true);
    }
});

export const translate = (
    key: keyof TranslationsDescriptors,
    values?: { [key: string]: string | number },
) => i18next.t(key, values);

export const checkIfKeyExists = (key: string): key is keyof TranslationsDescriptors => i18next.exists(key);

export default useTranslations;

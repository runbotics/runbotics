import React from 'react';
import i18next from 'i18next';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { sanitize } from 'dompurify';
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

    return {
        translate,
        translateHTML,
        switchLanguage,
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

export const checkIfKeyExists = (keyPath: string, key: string ) => {
    const { t, i18n } = useTranslation();

    const exist = i18n.exists(keyPath + key)

    return exist
}

export const convertToPascalCase = (rawText: string) => {
    const text = rawText.toLowerCase().replace('_', ' ')

    let pascalCaseKey = ""

    for(let i = 0; i<text.length; i++){
        if(text[i]===" ") {
            pascalCaseKey += text[i+1].toUpperCase()
            i++
        } else if (i===0) {
            pascalCaseKey += text[i].toUpperCase()
        } else {
            pascalCaseKey+=text[i]
        }
    }

    return pascalCaseKey
}

export default useTranslations;

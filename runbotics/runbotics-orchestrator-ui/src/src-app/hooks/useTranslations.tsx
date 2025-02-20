import React, { useEffect } from 'react';

import { sanitize } from 'dompurify';
import i18next from 'i18next';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { useSelector } from '#src-app/store';

import { TranslationsDescriptors, Language, languages } from '../translations/translations';

const useTranslations = () => {
    const { t, i18n } = useTranslation();
    const { loadedPlugins } = useSelector((state) => state.plugin);

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

    useEffect(() => {
        if (!loadedPlugins) return;

        loadedPlugins.forEach(plugin => {
            for (const [_, { translations }] of Object.entries(plugin)) {
                const en = languages[0];
                const pl = languages[1];
                const ns = 'translation';

                i18n.addResourceBundle(en, ns, translations[en][ns], true);
                i18n.addResourceBundle(pl, ns, translations[pl][ns], true);
            }
        });
    }, [loadedPlugins]);

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

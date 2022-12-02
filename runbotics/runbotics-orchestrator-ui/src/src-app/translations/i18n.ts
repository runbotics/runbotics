import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations, { DEFAULT_LANG } from './translations';

i18n
    .use(initReactI18next)
    .init({
        resources: translations,
        initImmediate: false,
        lng: DEFAULT_LANG,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;

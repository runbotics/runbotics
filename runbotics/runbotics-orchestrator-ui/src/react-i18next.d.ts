import 'react-i18next';

import en from './translations/en';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'en';
        resources: {
            en: typeof en;
        }
    }
}

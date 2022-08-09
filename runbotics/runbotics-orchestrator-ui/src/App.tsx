import 'moment/locale/pl';

import React, { Suspense } from 'react';
import type { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import { initReactI18next, withTranslation } from 'react-i18next';

import ScrollReset from './components/ScrollReset';
import routes, { renderRoutes } from './pages/routes';
import SnackbarProvider from './providers/Snackbar.provider';
import StylesProvider from './providers/Styles.provider';
import SocketProvider from './providers/Socket.provider';
import InitializeAuth from './views/auth/InitializeAuth';
import translations, { DEFAULT_LANG } from './translations/translations';

// without this line it didn't work
moment.locale(DEFAULT_LANG);

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

const App: FC = () => (
    <StylesProvider>
        <SnackbarProvider>
            <Suspense fallback={false}>
                <HashRouter>
                    <InitializeAuth>
                        <SocketProvider>
                            <ScrollReset />
                            {renderRoutes(routes)}
                        </SocketProvider>
                    </InitializeAuth>
                </HashRouter>
            </Suspense>
        </SnackbarProvider>
    </StylesProvider>
);

export default withTranslation()(App);

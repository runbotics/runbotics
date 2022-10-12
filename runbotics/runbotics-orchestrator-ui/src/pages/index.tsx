import 'moment/locale/pl';
import React, { Suspense } from 'react';
import type { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { enableES5 } from 'immer';
import ScrollReset from '../components/ScrollReset';
import routes, { renderRoutes } from '../routing/routes';
import SnackbarProvider from '../providers/Snackbar.provider';
import StylesProvider from '../providers/Styles.provider';
import SocketProvider from '../providers/Socket.provider';
import InitializeAuth from '../views/auth/InitializeAuth';
import { DEFAULT_LANG } from '../translations/translations';
import i18n from '../translations/i18n';
import store from 'src/store';
import { SettingsProvider } from 'src/contexts/SettingsContext';

// without this line it didn't work
moment.locale(DEFAULT_LANG);
enableES5();

const App: FC = () => (
    <Provider store={store}>
        <SettingsProvider>
            <I18nextProvider i18n={i18n}>
                <StylesProvider>
                    <SnackbarProvider>
                        {/* <Suspense fallback={false}> */}
                        {/* <HashRouter> */}
                        <InitializeAuth>
                            <SocketProvider>{renderRoutes(routes)}</SocketProvider>
                        </InitializeAuth>
                        {/* </HashRouter> */}
                        {/* </Suspense> */}
                    </SnackbarProvider>
                </StylesProvider>
            </I18nextProvider>
        </SettingsProvider>
    </Provider>
);

export default App;

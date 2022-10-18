import { CacheProvider } from '@emotion/react';
import createEmotionCache from 'src/utils/createEmotionCache';
import 'moment/locale/pl';
import moment from 'moment';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { enableES5 } from 'immer';
import SnackbarProvider from '../providers/Snackbar.provider';
import StylesProvider from '../providers/Styles.provider';
import SocketProvider from '../providers/Socket.provider';
import InitializeAuth from '../views/auth/InitializeAuth';
import { DEFAULT_LANG } from '../translations/translations';
import i18n from '../translations/i18n';
import store from 'src/store';
import { SettingsProvider } from 'src/contexts/SettingsContext';
import Head from 'next/Head';

import 'src/theme/cronStyles.css';
// without this line it didn't work
moment.locale(DEFAULT_LANG);
enableES5();
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
    const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

    return (
        <>
            <Head>
                <title>Runbotics</title>
            </Head>
            <CacheProvider value={emotionCache}>
                <Provider store={store}>
                    <SettingsProvider>
                        <I18nextProvider i18n={i18n}>
                            <StylesProvider>
                                <SnackbarProvider>
                                    <InitializeAuth>
                                        <SocketProvider>
                                            <Component {...pageProps} />
                                        </SocketProvider>
                                    </InitializeAuth>
                                </SnackbarProvider>
                            </StylesProvider>
                        </I18nextProvider>
                    </SettingsProvider>
                </Provider>
            </CacheProvider>
        </>
    );
};
export default MyApp;

import React, { FC } from 'react';

import { CacheProvider, EmotionCache } from '@emotion/react';

import moment from 'moment';
import { default as NextApp, AppProps as PageProps } from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';

import { I18nextProvider } from 'react-i18next';

import { Provider } from 'react-redux';

import { SettingsProvider } from 'src/contexts/SettingsContext';
import MainLayout from 'src/layouts/MainLayout';
import store from 'src/store';
import createEmotionCache from 'src/utils/createEmotionCache';

import 'moment/locale/pl';
import SnackbarProvider from '../providers/Snackbar.provider';
import SocketProvider from '../providers/Socket.provider';
import StylesProvider from '../providers/Styles.provider';
import i18n from '../translations/i18n';
import { DEFAULT_LANG } from '../translations/translations';
import InitializeAuth from '../views/auth/InitializeAuth';

const { publicRuntimeConfig } = getConfig();

import 'src/theme/cronStyles.css';

interface AppProps extends PageProps {
    emotionCache?: EmotionCache;
    runboticsEntrypointUrl: string;
}

// without this line it didn't work
moment.locale(DEFAULT_LANG);
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function App(props: AppProps) {
    const { Component, pageProps, emotionCache = clientSideEmotionCache, router } = props;
    let Layout: FC = React.Fragment;

    if (router.pathname.startsWith('/app/')) {
        Layout = MainLayout;
    }    

    return (
        <div style={{ height: '100%' }}>
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
                                        <SocketProvider uri={props.runboticsEntrypointUrl}>
                                            <Layout>
                                                <Component {...pageProps} />
                                            </Layout>
                                        </SocketProvider>
                                    </InitializeAuth>
                                </SnackbarProvider>
                            </StylesProvider>
                        </I18nextProvider>
                    </SettingsProvider>
                </Provider>
            </CacheProvider>
        </div>
    );
}

App.getInitialProps = async (context) => {
    const pageProps = await NextApp.getInitialProps(context);

    return {
        ...pageProps,
        runboticsEntrypointUrl: publicRuntimeConfig.runboticsEntrypointUrl,
    };
};

export default App;

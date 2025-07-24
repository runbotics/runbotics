import React, { FC, ReactNode } from 'react';

import { MsalProvider } from '@azure/msal-react';
import { CacheProvider, EmotionCache } from '@emotion/react';

import moment from 'moment';
import { AppContext, default as NextApp, AppProps as PageProps } from 'next/app';
import getConfig from 'next/config';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import 'moment/locale/pl';
import { CartProvider } from '#src-app/contexts/CartContext';
import { SettingsProvider } from '#src-app/contexts/SettingsContext';
import MainLayout from '#src-app/layouts/MainLayout';
import SnackbarProvider from '#src-app/providers/Snackbar.provider';
import StylesProvider from '#src-app/providers/Styles.provider';
import store from '#src-app/store';
import i18n from '#src-app/translations/i18n';
import { DEFAULT_LANG } from '#src-app/translations/translations';
import createEmotionCache from '#src-app/utils/createEmotionCache';
import msalInstance from '#src-app/utils/msal';

const { publicRuntimeConfig } = getConfig();

import '#src-landing/scss/main.scss';
import '#src-landing/scss/global.scss';
import Metadata from '#src-landing/components/Matadata/Metadata';

interface AppProps extends PageProps {
    children: ReactNode | ReactNode[];
    runboticsEntrypointUrl: string;
    emotionCache?: EmotionCache;
}

// without this line it didn't work
moment.locale(DEFAULT_LANG);
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function App(props: AppProps) {
    const {
        Component,
        pageProps: { metadata, ...restPageProps },
        emotionCache = clientSideEmotionCache,
        router,
    } = props;
    let Layout: FC<{ children: ReactNode | ReactNode[] }> = React.Fragment;

    if (router.pathname.startsWith('/app/')) {
        Layout = MainLayout;
    }

    return (

        <div style={{ height: '100%' }}>
            <Metadata metadata={metadata} />
            <CacheProvider value={emotionCache}>
                <Provider store={store}>
                    <SettingsProvider>
                        <I18nextProvider i18n={i18n}>
                            <StylesProvider>
                                <SnackbarProvider>
                                    <MsalProvider instance={msalInstance}>
                                        <CartProvider>
                                            <Layout>
                                                <Component {...restPageProps} />
                                            </Layout>
                                        </CartProvider>
                                    </MsalProvider>
                                </SnackbarProvider>
                            </StylesProvider>
                        </I18nextProvider>
                    </SettingsProvider>
                </Provider>
            </CacheProvider>
        </div>

    );
}

App.getInitialProps = async (context: AppContext) => {
    const pageProps = await NextApp.getInitialProps(context);

    return {
        ...pageProps,
        runboticsEntrypointUrl: publicRuntimeConfig.runboticsEntrypointUrl,
    };
};

export default App;

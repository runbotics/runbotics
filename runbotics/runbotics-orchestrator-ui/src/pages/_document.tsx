/* eslint-disable @next/next/google-font-display */
import React from 'react';

import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const styledComponentsSheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => styledComponentsSheet.collectStyles(<App {...props} />),
                });
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <React.Fragment>
                        {initialProps.styles}
                        {styledComponentsSheet.getStyleElement()}
                    </React.Fragment>
                ),
            };
        } finally {
            styledComponentsSheet.seal();
        }
    }

    render() {
        return (
            <Html lang="en" dir="ltr">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="icon" href="/images/favicon.ico" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,100&display=swap" rel="stylesheet"/>
                    <meta name="description" content="RunBotics" />
                    <meta name="keywords" content="RunBotics" />
                    <meta name="author" content="RunBotics" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

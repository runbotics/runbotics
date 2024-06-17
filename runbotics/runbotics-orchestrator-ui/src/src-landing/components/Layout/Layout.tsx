import React from 'react';

import Footer from '#src-landing/components/Footer';
import Header from '#src-landing/components/Header';
import { MAIN_CONTENT_ID } from '#src-landing/utils/utils';

import styles from './Layout.module.scss';
import { ChatThemeProvider } from '../Header/ChatThemeToggle/ChatThemeProvider';

const Layout = ({ children, disableScroll = false }) => (
    <>
        <ChatThemeProvider>
            <Header />
            <div
                className={`${styles.mainWrapper} ${
                    disableScroll ? styles.disableScroll : ''
                }`}
            >
                <main id={MAIN_CONTENT_ID} tabIndex={-1}>
                    {children}
                </main>
                <Footer />
            </div>
        </ChatThemeProvider>
    </>
);

export default Layout;

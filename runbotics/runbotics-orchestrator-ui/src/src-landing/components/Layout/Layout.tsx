import React from 'react';

import Footer from '#src-landing/components/Footer';
import Header from '#src-landing/components/Header';
import { MAIN_CONTENT_ID } from '#src-landing/utils/utils';

import styles from './Layout.module.scss';

const Layout = ({ children, disableScroll = false }) => (
    <>
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
    </>
);

export default Layout;

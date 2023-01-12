import React from 'react';

import Footer from '#src-landing/components/Footer';
import Header from '#src-landing/components/Header';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
    <>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
    </>
);

export default Layout;

import React from 'react';

import Header from '#src-landing/components/Header';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
    <>
        <Header />
        <main className={styles.main}>{children}</main>
        <footer></footer>
    </>
);

export default Layout;

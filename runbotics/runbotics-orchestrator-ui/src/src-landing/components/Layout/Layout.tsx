import React from 'react';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
    <>
        <nav></nav>
        <main className={styles.main}>{children}</main>
        <footer></footer>
    </>
);

export default Layout;

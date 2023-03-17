import React from 'react';

import Footer from '#src-landing/components/Footer';
import Header from '#src-landing/components/Header';
import { MAIN_CONTENT_ID } from '#src-landing/utils/utils';

const Layout = ({ children }) => (
    <>
        <Header />
        <main id={MAIN_CONTENT_ID} tabIndex={-1}>{children}</main>
        <Footer />
    </>
);

export default Layout;

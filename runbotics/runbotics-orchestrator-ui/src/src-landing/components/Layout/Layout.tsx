import React from 'react';

import Footer from '#src-landing/components/Footer';
import Header from '#src-landing/components/Header';

const Layout = ({ children }) => (
    <>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
);

export default Layout;

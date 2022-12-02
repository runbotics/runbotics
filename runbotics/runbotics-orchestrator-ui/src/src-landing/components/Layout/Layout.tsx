import React, { FC } from 'react';

interface LayoutProps {};

const Layout: FC<LayoutProps> = ({children}) => (
    <>
        <nav></nav>
        <main>{children}</main>
        <footer></footer>
    </>
);

export default Layout;

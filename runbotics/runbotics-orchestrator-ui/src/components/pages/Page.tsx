import React, { forwardRef } from 'react';
import type { HTMLProps, ReactNode } from 'react';
import Head from 'next/head';

interface PageProps extends HTMLProps<HTMLDivElement> {
    children?: ReactNode;
    title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, title = '', ...rest }, ref) => (
    <div ref={ref as any} {...rest}>
        <Head>
            <title>{title}</title>
        </Head>
        {children}
    </div>
));

export default Page;

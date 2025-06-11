import React, { FC } from 'react';

import Head from 'next/head';

export interface MetadataTags {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
}

interface Metadata {
    metadata: MetadataTags;
}

const DEFAULT_TAG_CONTENT = 'RunBotics';

const Metadata: FC<Metadata> = ({ metadata }) => {
    const getContent = (tag: string) => (metadata && metadata[tag]) ?? DEFAULT_TAG_CONTENT;

    return (
        <Head>
            <title>{getContent('title')}</title>
            <meta name="description" content={getContent('description')} />
            <meta name="keywords" content={getContent('keywords')} />
            <meta name="author" content={getContent('author')} />
            {metadata && metadata.image && <meta property="og:image" content={metadata.image} />}
            <link rel="alternate" hrefLang="pl" href="https://runbotics.com/pl" />
            <link rel="alternate" hrefLang="en" href="https://runbotics.com" />
        </Head>
    );
};

export default Metadata;

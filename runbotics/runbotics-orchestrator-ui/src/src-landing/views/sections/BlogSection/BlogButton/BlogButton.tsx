import React, { VFC } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

const BlogButton: VFC = () => {
    const { translate } = useTranslations();
    return (
        <Link href={'/blog'}>
            {translate('Landing.Blog.Link.Title')}
        </Link>
    );
};

export default BlogButton;

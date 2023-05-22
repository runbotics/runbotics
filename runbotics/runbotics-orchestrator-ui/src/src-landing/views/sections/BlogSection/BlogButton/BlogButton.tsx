import React, { VFC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ChevronRight from '#public/images/icons/chevron_right_black.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './BlogButton.module.scss';

const BlogButton: VFC = () => {
    const { translate } = useTranslations();
    return (
        <Link className={styles.link} href={'/blog'}>
            <Typography className={styles.title} variant='h5'>
                {translate('Landing.Blog.Link.Title')}
            </Typography>
            <div className={styles.iconWrapper}>
                <Image className={styles.icon} src={ChevronRight} alt='' width={40} height={40} />
            </div>
        </Link>
    );
};

export default BlogButton;

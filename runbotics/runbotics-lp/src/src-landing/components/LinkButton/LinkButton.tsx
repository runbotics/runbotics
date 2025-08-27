import React, { VFC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ChevronRight from '#public/images/icons/chevron_right_black.svg';
import Typography from '#src-landing/components/Typography';

import styles from './LinkButton.module.scss';

interface Props {
    href: string;
    title: string;
}

const LinkButton: VFC<Props> = ({ href, title }) => (
    <Link className={styles.link} href={href}>
        <Typography className={styles.title} variant='h5'>
            {title}
        </Typography>
        <div className={styles.iconWrapper}>
            <Image
                className={styles.icon}
                src={ChevronRight}
                alt=''
                width={40}
                height={40}
            />
        </div>
    </Link>
);

export default LinkButton;

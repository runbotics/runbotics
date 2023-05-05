import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import homeIcon from '#public/images/icons/home.svg';
import If from '#src-app/components/utils/If';
import Typography from '#src-landing/components/Typography';
import { capitalizeFirstLetter } from '#src-landing/utils/utils';

import styles from './BreadcrumbsSection.module.scss';
import { BreadcrumbsSectionProps } from './BreadcrumbsSection.types';

const BreadcrumbsSection: FC<BreadcrumbsSectionProps> = ({
    postTitle,
}) => {
    const router = useRouter();
    const { pathname, asPath } = router;
    const queryChars = ['?', '&', '='];
    const uncoveredUrlPart = 'post';

    const relevantPath = queryChars
        .filter(
            param => 
                asPath.indexOf(param) !== -1
        )
        .length === 0 ? asPath : pathname;

    const rawBreadcrumbs: string[] = relevantPath
        .split('/')
        .filter(
            (breadcrumb) => breadcrumb !== ''
        );

    const breadcrumbs = rawBreadcrumbs.map((breadcrumb, index) => {
        const isLast = index === rawBreadcrumbs.length - 1;
        const actualUrl = `/${rawBreadcrumbs.slice(0, index + 1).join('/')}`;

        return (
            <div key={breadcrumb} className={styles.breadcrumb}>
                <If condition={breadcrumb !== uncoveredUrlPart}>
                    <If condition={!isLast} 
                        else={
                            <Typography>
                                {postTitle ?? capitalizeFirstLetter(breadcrumb)}
                            </Typography>
                        }
                    >
                        <Link 
                            className={styles.link} 
                            href={actualUrl}
                        >
                            <Typography color='accent'>
                                {capitalizeFirstLetter(breadcrumb)}
                            </Typography>
                        </Link>
                        <Typography 
                            className={styles.separator} 
                            color='primary'
                        >
                            /
                        </Typography>
                    </If>
                </If>
            </div>
        );
    });

    return (
        <div className={styles.root}>
            <Link href='/' className={styles.homeLink}>
                <Image 
                    src={homeIcon} 
                    alt='robot' 
                    className={styles.icon} 
                    width="24" 
                    height="24"
                />
                <Typography className={styles.link} color='accent'>
                    Home
                </Typography>
            </Link>
            <Typography className={styles.separator}>
                    /
            </Typography>
            {breadcrumbs}
        </div>
    );
};

export default BreadcrumbsSection;

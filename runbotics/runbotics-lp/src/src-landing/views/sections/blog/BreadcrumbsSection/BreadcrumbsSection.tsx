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
    subPageTitle,
    baseUrl = 'post'
}) => {

    const { pathname, asPath } = useRouter();
    const uncoveredUrlPart = baseUrl;

    const relevantPath = asPath.includes(uncoveredUrlPart) ? asPath : pathname;

    const urlParts: string[] = relevantPath
        .slice(1)
        .split('/');

    const rawParts = urlParts
        .filter(
            (part) => part !== uncoveredUrlPart,
        );

    const breadcrumbs = rawParts.map(
        (part, index) => {
            const isLast = index === rawParts.length - 1;
            const actualUrl = `/${urlParts.slice(0, index + 1).join('/')}`;
            const capitalizedPart = capitalizeFirstLetter(part);

            return (
                <div key={part} className={styles.breadcrumb}>
                    <If condition={!isLast}
                        else={
                            <Typography>
                                {subPageTitle ?? capitalizedPart}
                            </Typography>
                        }
                    >
                        <Link
                            className={styles.link}
                            href={actualUrl}
                        >
                            <Typography color="accent">
                                {capitalizedPart}
                            </Typography>
                        </Link>
                        <Typography
                            className={styles.separator}
                            color="primary"
                        >
                            /
                        </Typography>
                    </If>

                </div>
            );
        });

    return (
        <div className={styles.root}>
            <Link href="/" className={styles.homeLink}>
                <Image
                    src={homeIcon}
                    alt="robot"
                    className={styles.icon}
                    width="32"
                    height="32"
                />
                <Typography className={styles.linkContent} color="accent">
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

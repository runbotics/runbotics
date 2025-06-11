
import { FC } from 'react';

import Link from 'next/link';

import { getPaginatedUrl } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './PaginationNavigation.module.scss';

interface PaginationNavigationProps {
    basePageUrl: string;
    currentPage: number;
    totalPages: number;
}


const PaginationNavigation: FC<PaginationNavigationProps> = ({ basePageUrl, currentPage, totalPages }) => {
    const { translate } = useTranslations();
    const currentUrl = window.location.href;
    const pageNumbers = Array.from(
        Array(totalPages).keys(), page => page + 1
    );
    const PAGE_LINK_SIZE = Number(
        styles
            .pageLinkSize
            .replace('px', '')
    );
    const VISIBLE_PAGE_LINKS_NUMBER = Number(styles.visiblePageLinks);
    const wrapperTranslateValue = (currentPage * PAGE_LINK_SIZE * -1) + (Math.ceil(VISIBLE_PAGE_LINKS_NUMBER / 2) * PAGE_LINK_SIZE);
    
    const pageLinks = pageNumbers.map(
        (number) => (
            <li key={number}>
                <Link 
                    className={`${styles.pageNumber} ${number === currentPage ? styles.active : ''}`} 
                    href={getPaginatedUrl(number, basePageUrl, currentUrl.split('?')[1])}
                    title={translate('Blog.Post.Pagination.ParticularPage', { number })}
                >
                    <Typography variant="body2">
                        {number}
                    </Typography>
                </Link>
            </li>
        )
    );

    return (
        <div className={styles.root}>
            <ul 
                className={styles.pageNumbersWrapper} 
                style={{ transform: `translateX(${wrapperTranslateValue}px)` }}
            >
                {pageLinks}
            </ul>
        </div>
    );
};

export default PaginationNavigation;

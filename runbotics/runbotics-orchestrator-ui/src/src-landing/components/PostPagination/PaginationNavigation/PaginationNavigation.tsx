
import { FC, useEffect, useRef } from 'react';

import Typography from '#src-landing/components/Typography';

import styles from './PaginationNavigation.module.scss';

interface PaginationNavigationProps {
    currentPage: number;
    totalPages: number;
    switchPage: (pageNumber: number) => void;
}


const PaginationNavigation: FC<PaginationNavigationProps> = ({ currentPage, totalPages, switchPage }) => {
    const paginationNavRef = useRef<HTMLDivElement>(null);
    const pageNumbers = Array.from(
        Array(totalPages).keys(), page => page + 1
    );

    useEffect(() => {
        if (paginationNavRef.current) {
            paginationNavRef.current.style.setProperty(
                '--current-page',
                currentPage.toString()
            );
        }
    }, [currentPage, totalPages]);

    return (
        <div className={styles.root} ref={paginationNavRef}>
            <div className={styles.pageNumbersWrapper}>
                {pageNumbers
                    .map((number) => (
                        <div 
                            key={number}
                            className={`${styles.pageNumberBtn} ${number === currentPage ? styles.active : ''}`} 
                            onClick={() => switchPage(number)}
                        >
                            <Typography variant="body2">
                                {number}
                            </Typography>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PaginationNavigation;

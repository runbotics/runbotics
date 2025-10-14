import { FC } from 'react';


import { Page } from '#contentful/common';
import If from '#src-app/components/utils/If';

import styles from './CardsPagination.module.scss';
import PaginationNavigation from './PaginationNavigation';
import SwitchPageButton from './SwitchPageButton';

export interface CardsPaginationProps {
    basePageUrl: string;
    page: Page;
}


const CardsPagination: FC<CardsPaginationProps> = ({ basePageUrl, page }) => {
    const { current: currentPage, total: totalPages } = page;

    return (
        <div className={styles.root}>
            <If condition={currentPage > 1}>
                <SwitchPageButton
                    basePageUrl={basePageUrl}
                    direction='Previous'
                    currentPage={currentPage}
                />
            </If>
            <PaginationNavigation
                basePageUrl={basePageUrl}
                currentPage={currentPage}
                totalPages={totalPages}
            />
            <If condition={currentPage < totalPages}>
                <SwitchPageButton
                    basePageUrl={basePageUrl}
                    direction='Next'
                    currentPage={currentPage}
                />
            </If>
        </div>
    );
};

export default CardsPagination;

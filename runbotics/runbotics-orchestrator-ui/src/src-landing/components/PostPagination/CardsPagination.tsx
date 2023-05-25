import { FC } from 'react';


import { Page } from '#contentful/common';
import If from '#src-app/components/utils/If';

import styles from './CardsPagination.module.scss';
import PaginationNavigation from './PaginationNavigation';
import SwitchPageButton from './SwitchPageButton';

export interface CardsPaginationProps {
    page: Page;
}


const CardsPagination: FC<CardsPaginationProps> = ({ page }) => {
    const { current: currentPage, total: totalPages } = page;

    return (
        <div className={styles.root}>
            <If condition={currentPage > 1}>
                <SwitchPageButton
                    direction='Previous'
                    currentPage={currentPage}
                />
            </If>
            <PaginationNavigation
                currentPage={currentPage}
                totalPages={totalPages}
            />
            <If condition={currentPage < totalPages}>
                <SwitchPageButton
                    direction='Next'
                    currentPage={currentPage}
                />
            </If>
        </div>
    );
};

export default CardsPagination;

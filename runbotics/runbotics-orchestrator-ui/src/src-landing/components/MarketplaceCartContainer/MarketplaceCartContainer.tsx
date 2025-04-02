import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import { Trash } from 'react-feather';

import { Column } from 'react-table';

import Table from '#src-app/components/tables/Table';
import { CartItem, useCart } from '#src-app/contexts/CartContext';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';

import styles from './MarketplaceCartContainer.module.scss';
import MarketplaceCartAccordion from '#src-landing/components/MarketplaceCartAccordion';

const MarketplaceCartContainer: FC = () => {
    return (
        <div className={styles.root}>
            <MarketplaceCartAccordion />
        </div>
    );
};

export default MarketplaceCartContainer;

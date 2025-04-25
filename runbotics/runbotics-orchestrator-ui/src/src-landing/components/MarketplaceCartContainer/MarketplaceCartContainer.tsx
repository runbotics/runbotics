import { FC } from 'react';

import MarketplaceCartAccordion from '#src-landing/components/MarketplaceCartAccordion';

import styles from './MarketplaceCartContainer.module.scss';

const MarketplaceCartContainer: FC = () => (
    <div className={styles.root}>
        <MarketplaceCartAccordion />
    </div>
);

export default MarketplaceCartContainer;

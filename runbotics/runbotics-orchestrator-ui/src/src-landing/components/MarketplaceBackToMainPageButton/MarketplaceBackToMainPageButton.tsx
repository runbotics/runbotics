import React, { FC } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import clsx from 'clsx';
import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

import styles from './MarketplaceBackToMainPageButton.module.scss';
import Typography from '../Typography';

interface Props {
    page: 'cart' | 'details';
}

const MarketplaceBackToMainPageButton: FC<Props> = ({ page }) => {
    const { translate } = useTranslations();
    return (
        <div className={clsx(
            styles.root,
            page === 'cart' && styles['root--cart'],
            page === 'details' && styles['root--details']
        )}>
            <Link
                key={'backToMarketplaceLink'}
                className={styles.backLink}
                href={'/marketplace'}
                title={'back to Marketplace'}
            >
                <Typography variant={'h6'} className={styles.text}>
                    <KeyboardArrowLeftIcon /> {translate('Marketplace.Card.BackToMarketplace')}
                </Typography>
            </Link>
        </div>
    );
};

export default MarketplaceBackToMainPageButton;

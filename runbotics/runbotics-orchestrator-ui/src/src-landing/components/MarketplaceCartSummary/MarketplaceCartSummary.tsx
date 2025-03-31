import { FC } from 'react';

import { Button } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import styles from './MarketplaceCartSummary.module.scss';

interface Props {
    approximatePrice: number;
    onSubmit: Function;
}

const MarketplaceCartSummary: FC<Props> = ({ approximatePrice, onSubmit }) => {
    const { translate } = useTranslations();
    return (
        <div className={styles.root}>
            <div className={styles.summary}>
                <h2>{translate('Marketplace.Cart.Summary')}</h2>
                <div>
                    <h3>{translate('Marketplace.Cart.Disclaimer')}:</h3>
                    <p>{translate('Marketplace.Cart.DisclaimerText')}</p>
                </div>
                <div>
                    <h3>{translate('Marketplace.Cart.ApproximatePrice')}:</h3>
                    <p>{approximatePrice} euro</p>
                </div>
                <Button
                    fullWidth
                    variant={'contained'}
                    sx={{
                        borderRadius: '20px',
                    }}
                    size={'large'}
                    onClick={() => onSubmit()}
                >
                    {translate('Marketplace.Cart.SendRequestForQuote')}
                </Button>
            </div>
        </div>
    );
};

export default MarketplaceCartSummary;

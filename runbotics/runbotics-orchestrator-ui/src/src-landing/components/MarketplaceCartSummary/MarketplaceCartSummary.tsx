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
                <h2>Summary</h2>
                <div>
                    <h3>Disclaimer:</h3>
                    <p>Our team prices products individually to your needs. Send us a request for a quote. Our
                        consultant will contact you to arrange all the details in 3 working days.</p>
                </div>
                <div>
                    <h3>Approximate price:</h3>
                    <p>{approximatePrice} euro</p>
                </div>
                <Button 
                    fullWidth
                    variant={'contained'}
                    sx={{
                        borderRadius: '20px',
                    }}
                    size={'large'}
                    disabled
                >
                    Send request for quote </Button>
            </div>
        </div>
    );
};

export default MarketplaceCartSummary;

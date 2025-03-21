import React, { FC, useState } from 'react';

import { Button, MenuItem, Select } from '@mui/material';

import { MarketplaceOffer } from '#contentful/common';
import { useCart } from '#src-app/contexts/CartContext';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './MarketplaceAddToCartSection.module.scss';
import Typography from '../Typography';

interface MarketplaceCardProps {
    offer: MarketplaceOffer;
}

const MarketplaceAddToCartSection: FC<MarketplaceCardProps> = ({ offer }) => {
    const [selectedParameters, setSelectedParameters] = useState<{
        name: string;
        selectedOption: string;
    }[]>(
        offer
            .additionalParameters
            ?.additionalParameters
            .map(parameter => ({
                name: parameter.name,
                selectedOption: parameter.options.find(param => param.isDefault)?.name ?? '',
            })) ?? []);
    const { addToCart } = useCart();
    const { translate } = useTranslations();
    const { additionalParameters } = offer;

    const onSubmit = () => {
        addToCart({
            ...offer,
            quantity: 1,
        });
    };
    return (
        <div className={styles.root}>
            <Typography variant={'h5'}>
                {translate(
                    'Marketplace.Offer.ApproximatePriceStartsFrom',
                    { price: additionalParameters?.basePrice ?? 0 },
                )}
            </Typography>
            <div>
                <Typography variant={'h6'}>
                    {translate('Marketplace.Offer.AmountOfLicences')}
                </Typography>
                <div>
                    1
                </div>
            </div>
            {
                additionalParameters?.additionalParameters?.length > 0 &&
                additionalParameters?.additionalParameters.map(param => (
                    <div>
                        <Typography variant={'h6'}>
                            {param.name}
                        </Typography>
                        <Select
                            fullWidth
                            value={selectedParameters.find(parameter => parameter.name === param.name)?.selectedOption ?? ''}
                            onChange={(e) => {
                                setSelectedParameters(prev => {
                                    const newState = structuredClone(prev);
                                    const idx = prev.findIndex(parameter => parameter.name === param.name);
                                    newState[idx] = {
                                        name: param.name,
                                        selectedOption: e.target.value.toString(),
                                    };
                                    return newState;
                                });
                            }}>
                            {param.options.map(option => {
                                return (
                                    <MenuItem value={option.name}>{option.name}</MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                ))
            }
            <div>
                <Typography variant={'h6'}>
                    {translate('Marketplace.Cart.Disclaimer')}:
                </Typography>
                <p>
                    {translate('Marketplace.Cart.DisclaimerText')}
                </p>
            </div>
            <Button
                variant={'contained'}
                sx={{
                    borderRadius: '20px',
                    fontWeight: 600,
                    background: '#F9B934',
                }}
                onClick={onSubmit}
            >
                {translate('Marketplace.Offer.AddProcessToCart')}
            </Button>
        </div>
    );
};

export default MarketplaceAddToCartSection;

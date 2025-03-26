import { FC, useCallback, useState } from 'react';

import { useSnackbar } from 'notistack';

import { useCart } from '#src-app/contexts/CartContext';
import useTranslations from '#src-app/hooks/useTranslations';
import { axiosInstance as axios } from '#src-app/utils/axios';
import ContactForm from '#src-landing/components/ContactForm';
import Layout from '#src-landing/components/Layout';

import MarketplaceCartContainer from '#src-landing/components/MarketplaceCartContainer';

import MarketplaceCartSummary from '#src-landing/components/MarketplaceCartSummary';

import styles from './MarketplaceCartView.module.scss';
import { MarketplaceContactBody } from '../../../pages/api/marketplace/contact';


const MarketplaceCartView: FC = () => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const { cart, contactFormValue } = useCart();
    const [selectedItems, setSelectedItems] = useState(cart.map(item => item.slug) ?? []);

    const currentPrice = cart.filter(item => selectedItems.includes(item.slug))
        .reduce(
            (
                accumulator,
                currentValue,
            ) => accumulator += ((currentValue.parameters?.basePrice ?? 0) * currentValue.quantity),
            0,
        );

    const getSelectedCartItems = useCallback(
        () => cart.filter(item => selectedItems.includes(item.slug)),
        [selectedItems, cart],
    );

    const onSubmit = async () => {
        const selectedCartItems = getSelectedCartItems();
        const body: MarketplaceContactBody = {
            ...contactFormValue,
            cartContent: selectedCartItems,
        };
        await axios
            .post('/api/marketplace/contact', body)
            .then(() => {
                enqueueSnackbar(
                    translate('Marketplace.Cart.EmailSent'),
                    {
                        variant: 'success',
                        autoHideDuration: 5000,
                    },
                );
            })
            .catch(() => {
                enqueueSnackbar(
                    translate('Marketplace.Cart.EmailError'),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                );
            });
    };
    return (
        <Layout>
            <div className={styles.root}>
                <div className={styles.cartWrapper}>
                    <h1 className={styles.cartHeader}>Your cart</h1>
                    <div className={styles.cartProductsWrapper}>
                        <h2>Chosen products ({cart.length})</h2>
                        <MarketplaceCartContainer
                            setSelectedItems={setSelectedItems}
                            selectedItems={selectedItems} />
                    </div>
                    <ContactForm />
                </div>
                <MarketplaceCartSummary
                    approximatePrice={currentPrice}
                    onSubmit={onSubmit} />
            </div>
        </Layout>
    );
};

export default MarketplaceCartView;

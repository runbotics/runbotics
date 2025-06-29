import { FC, useCallback } from 'react';

import { useSnackbar } from 'notistack';

import { isEmailValid } from 'runbotics-common';

import { useCart } from '#src-app/contexts/CartContext';
import useTranslations from '#src-app/hooks/useTranslations';
import { axiosInstance as axios, AxiosInstanceError } from '#src-app/utils/axios';
import ContactForm from '#src-landing/components/ContactForm';
import Layout from '#src-landing/components/Layout';

import MarketplaceBackToMainPageButton from '#src-landing/components/MarketplaceBackToMainPageButton';
import MarketplaceCartContainer from '#src-landing/components/MarketplaceCartContainer';

import MarketplaceCartSummary from '#src-landing/components/MarketplaceCartSummary';

import styles from './MarketplaceCartView.module.scss';
import { MarketplaceContactBody } from '../../../pages/api/marketplace/contact';

const SNACKBAR_AUTOHIDE_DURATION = 5000;

const MarketplaceCartView: FC = () => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const { cart, contactFormValue, selectedCartItems, resetFormValue} = useCart();

    const fullPrice = cart.filter(item => selectedCartItems.includes(item.slug))
        .reduce(
            (
                accumulator,
                currentValue,
            ) => accumulator += ((currentValue.parameters?.basePrice ?? 0) * currentValue.quantity),
            0,
        );

    const getSelectedCartItems = useCallback(
        () => cart.filter(item => selectedCartItems.includes(item.slug)),
        [selectedCartItems, cart],
    );

    const onSubmit = async () => {
        const selectedFullCartItems = getSelectedCartItems();
        const body: MarketplaceContactBody = {
            ...contactFormValue,
            cartContent: selectedFullCartItems,
        };

        if (contactFormValue.name.trim().length === 0) {
            enqueueSnackbar(
                translate('Marketplace.Cart.NoNameAndSurnameError'),
                {
                    variant: 'error',
                    autoHideDuration: SNACKBAR_AUTOHIDE_DURATION,
                }
            );
            return;
        }

        if (!isEmailValid(contactFormValue.email)) {
            enqueueSnackbar(translate('Marketplace.Cart.NoEmailError'), {
                variant: 'error',
                autoHideDuration: SNACKBAR_AUTOHIDE_DURATION,
            });
            return;
        }

        await axios
            .post('/api/marketplace/contact', body)
            .then(() => {
                enqueueSnackbar(translate('Marketplace.Cart.EmailSent'), {
                    variant: 'success',
                    autoHideDuration: SNACKBAR_AUTOHIDE_DURATION,
                });
                resetFormValue();
            })
            .catch((error: AxiosInstanceError) => {
                if (error.status === 429) {
                    enqueueSnackbar(translate('Marketplace.Cart.TooManyRequests'), {
                        variant: 'error',
                        autoHideDuration: SNACKBAR_AUTOHIDE_DURATION,
                    });
                } else {
                    enqueueSnackbar(translate('Marketplace.Cart.EmailError'), {
                        variant: 'error',
                        autoHideDuration: SNACKBAR_AUTOHIDE_DURATION,
                    });
                }
            });
    };
    return (
        <Layout>
            <MarketplaceBackToMainPageButton page={'cart'} />
            <div className={styles.root}>
                <div className={styles.cartWrapper}>
                    <h1 className={styles.cartHeader}>Your cart</h1>
                    <div className={styles.cartProductsWrapper}>
                        <h2>Chosen products ({cart.length})</h2>
                        <MarketplaceCartContainer />
                    </div>
                    <ContactForm />
                </div>
                <MarketplaceCartSummary
                    approximatePrice={fullPrice}
                    onSubmit={onSubmit}
                />
            </div>
        </Layout>
    );
};

export default MarketplaceCartView;

import React, { FC } from 'react';

import { ShoppingBasketOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { useCart } from '#src-app/contexts/CartContext';

import styles from './MarketplaceCartButton.module.scss';

const MarketplaceCartButton: FC = () => {
    const { cart } = useCart();
    const { push } = useRouter();
    return (
        <div className={styles.marketplaceCartButton}
            onClick={() => {
                push('/marketplace/cart');
            }}>
            {cart.length > 0 && <div className={styles.marketplaceItemsCount}>{cart.length}</div>}
            <ShoppingBasketOutlined sx={{
                width: '80%',
                height: '80%',
            }} />
        </div>
    );
};

export default MarketplaceCartButton;

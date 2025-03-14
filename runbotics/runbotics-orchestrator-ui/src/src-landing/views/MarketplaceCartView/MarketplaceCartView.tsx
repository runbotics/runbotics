import { FC } from 'react';

import { useCart } from '#src-app/contexts/CartContext';
import Layout from '#src-landing/components/Layout';

import MarketplaceCartContainer from '#src-landing/components/MarketplaceCartContainer';

import styles from './MarketplaceCartView.module.scss';

const MarketplaceCartView: FC = () => {
    const { cart } = useCart();
    return (<Layout>
        <div className={styles.root}>
            <div className={styles.cartWrapper}>
                <h1 className={styles.cartHeader}>Your cart</h1>
                <div className={styles.cartProductsWrapper}>
                    <h2>Chosen products  ({cart.length})</h2>
                    <MarketplaceCartContainer />
                </div>
                <div className={styles.contactForm}>
                    
                </div>
            </div>
            <div className={styles.summaryWrapper}>summaryWrapper</div>
        </div>
    </Layout>
    );
};

export default MarketplaceCartView;

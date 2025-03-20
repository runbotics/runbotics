import { FC, useState } from 'react';

import { useCart } from '#src-app/contexts/CartContext';
import Layout from '#src-landing/components/Layout';

import MarketplaceCartContainer from '#src-landing/components/MarketplaceCartContainer';

import MarketplaceCartSummary from '#src-landing/components/MarketplaceCartSummary';

import styles from './MarketplaceCartView.module.scss';

const MarketplaceCartView: FC = () => {
    const { cart } = useCart();
    const [selectedItems, setSelectedItems] = useState(cart.map(item => item.id) ?? []);
    
    const currentPrice = cart.filter(item => selectedItems.includes(item.id))
        .reduce((a, b) => a = a + (b.price * b.quantity), 0);
    return (<Layout>
        <div className={styles.root}>
            <div className={styles.cartWrapper}>
                <h1 className={styles.cartHeader}>Your cart</h1>
                <div className={styles.cartProductsWrapper}>
                    <h2>Chosen products  ({cart.length})</h2>
                    <MarketplaceCartContainer 
                        setSelectedItems={setSelectedItems}
                        selectedItems={selectedItems}/>
                </div>
                <div className={styles.contactForm}>
                    <h1>Work in progress</h1>
                </div>
            </div>
            <MarketplaceCartSummary
                approximatePrice={currentPrice}
                onSubmit={() => {}}/>
        </div>
    </Layout>
    );
};

export default MarketplaceCartView;

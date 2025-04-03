import React, { FC } from 'react';

import { useCart } from '#src-app/contexts/CartContext';

import { AccordionElement } from '#src-landing/components/MarketplaceCartAccordion/AccordionElement';

const MarketplaceCartAccordion: FC = () => {
    const { cart } = useCart();
    return (
        <div>
            {cart.map(offer => <AccordionElement key={offer.slug} {...offer} />)}
        </div>
    );
};

export default MarketplaceCartAccordion;

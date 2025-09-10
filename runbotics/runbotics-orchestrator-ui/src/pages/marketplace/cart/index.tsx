import { VFC } from 'react';

import { GetServerSideProps } from 'next';

import MarketplaceBg from '#public/images/banners/marketplace-banner.png';
import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import MarketplaceCartView from '#src-landing/views/MarketplaceCartView/MarketplaceCartView';

const MarketplaceCart: VFC = () => <MarketplaceCartView />;

export const getServerSideProps: GetServerSideProps = () => {
    const metadata: MetadataTags = {
        title: 'RunBotics | Marketplace',
        description: 'RunBotics - Marketplace',
        image: MarketplaceBg.src,
    };

    return Promise.resolve({
        props: {
            metadata,
        }
    });

};

export default MarketplaceCart;

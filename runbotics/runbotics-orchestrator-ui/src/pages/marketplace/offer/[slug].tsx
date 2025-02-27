import { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { isCached, MarketplaceOffer, recreateCache } from '#contentful/common';
import { getSingleMarketplaceOfferCache } from '#contentful/marketplace-post';
import { Language } from '#src-app/translations/translations';
import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import MarketplaceOfferView from '#src-landing/views/MarketplaceOfferView';

interface Props {
    offer: MarketplaceOffer;
}

interface Params extends Record<string, string> {
    slug: string;
}

const Offer: VFC<Props> = ({ offer }) => <MarketplaceOfferView offer={offer}/>;

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, locale, res }) => {
    const language = locale as Language;

    if (!isCached(language)) {
        await recreateCache(language);
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const offer = getSingleMarketplaceOfferCache(language, params.slug);

    if (!offer) {
        return {
            notFound: true,
        };
    }

    const metadata: MetadataTags = {
        title: `${offer.title} | Runbotics Blog`,
        description: offer.description,
    };

    return {
        props: {
            offer,
            metadata,
        },
    };
};

export default Offer;

import { VFC } from 'react';

import { MarketplaceOffer } from '#contentful/common';
import Layout from '#src-landing/components/Layout';
import MarketplaceAddToCartSection from '#src-landing/components/MarketplaceAddToCartSection';
import MarketplaceCartButton from '#src-landing/components/MarketplaceCartButton';
import OfferHeader from '#src-landing/components/OfferHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';

import styles from './MarketplaceOfferView.module.scss';


interface Props {
    offer: MarketplaceOffer;
}

const MarketplaceOfferView: VFC<Props> = ({ offer }) => {
    const {
        body,
        title,
        industries,
    } = offer;

    return (
        <Layout>
            <div className={styles.offerWrapper}>
                <OfferHeader
                    title={title}
                    industries={industries}
                />
                <div className={styles.detailsWrapper}>
                    <article className={styles.contentArticle}>
                        <RichTextRenderer content={body} />
                    </article>
                    <MarketplaceAddToCartSection offer={offer} />
                </div>
            </div>
            <MarketplaceCartButton />
        </Layout>
    );
};

export default MarketplaceOfferView;

import { VFC } from 'react';

import { MarketplaceOffer } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import Layout from '#src-landing/components/Layout';
import OfferHeader from '#src-landing/components/OfferHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';

import styles from './MarketplaceOfferView.module.scss';

interface Props {
    offer: MarketplaceOffer;
}

const MarketplaceOfferView: VFC<Props> = ({ offer }) => {
    const {
        body,
        tags,
        title,
        industries,
    } = offer;

    return (
        <Layout>
            <div className={styles.blogWrapper}>
                <OfferHeader
                    tags={tags}
                    title={title}
                    industries={industries}
                />
                <article className={styles.contentArticle}>
                    <RichTextRenderer content={body}/>
                </article>
            </div>
        </Layout>
    );
};

export default MarketplaceOfferView;

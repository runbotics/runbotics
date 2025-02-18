// @ts-nocheck
import { FC, useState } from 'react';

import { Industry, MarketplaceOffer, Page, Tag } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { HeadImage } from '#src-landing/components/ContentFulHeadImage/ContentFulHeadImage';
import Layout from '#src-landing/components/Layout';
import Typography from '#src-landing/components/Typography';
import ContentFulLayout from 'src/src-landing/components/ContentFulLayout';

import styles from './MarketplaceView.module.scss';
import CardsSection from '../sections/blog/CardsSection';


interface MarketplaceViewProps {
    offers: MarketplaceOffer[];
    industries: Industry[];
    tags: Tag[];
    page: Page;
}

const MarketplaceView: FC<MarketplaceViewProps> = ({ offers, industries, tags, page }) => {
    const [isFilterDisplayed, setFilterDisplayed] = useState(false);

    const { translate } = useTranslations();

    const offersNotFoundInfo = (
        <div className={styles.emptyPageContentWrapper}>
            <Typography variant="h3">
                {translate('Marketplace.EmptyPage.Title')}
            </Typography>
        </div>
    );

    return (
        <Layout disableScroll={isFilterDisplayed}>
            <ContentFulLayout
                baseImage={'hero-background'}
                headImageClass={HeadImage.marketplace}
            >
                <div style={{ border: 'solid black 1px' }}>
                    place for filters section
                </div>
                <If condition={Boolean(offers.length)} else={offersNotFoundInfo}>
                    <CardsSection
                        pageType={'marketplace'}
                        cards={offers}
                        featuredCard={null}
                        page={page}
                    />
                </If>
            </ContentFulLayout>
        </Layout>
    );
};

export default MarketplaceView;

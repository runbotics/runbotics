import { FC, useState } from 'react';

import { Industry, MarketplaceOffer, Page, Tag } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import { PageType } from '#src-landing/components/BlogCardsGrid/CardsGrid';
import { HeadImage } from '#src-landing/components/ContentFulHeadImage/ContentFulHeadImage';
import Layout from '#src-landing/components/Layout';
import MarketplaceCartButton from '#src-landing/components/MarketplaceCartButton';
import Typography from '#src-landing/components/Typography';
import { ClientOnly } from '#src-landing/noSSR';
import FiltersSection from '#src-landing/views/sections/marketplace/FilterSection';
import SearchBarSection from '#src-landing/views/sections/marketplace/SearchBarSection';
import ContentFulLayout from 'src/src-landing/components/ContentFulLayout';

import styles from './MarketplaceView.module.scss';
import CardsSection from '../sections/blog/CardsSection';



interface MarketplaceViewProps {
    offers: MarketplaceOffer[];
    industries: Industry[];
    tags: Tag[];
    page: Page;
}

const MarketplaceView: FC<MarketplaceViewProps> = ({ offers, industries, page }) => {
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
            <ClientOnly>
                <ContentFulLayout
                    baseImage={'hero-background'}
                    headImageClass={HeadImage.MARKETPLACE}
                >
                    <FiltersSection
                        handleFilterDisplayed={setFilterDisplayed}
                        isFilterDisplayed={isFilterDisplayed}
                        industries={industries}
                    />
                    <CardsSection
                        pageType={PageType.MARKETPLACE}
                        cards={offers}
                        featuredCard={null}
                        page={page}
                        searchBar={<SearchBarSection />}
                        notFoundInfo={offersNotFoundInfo}
                        isNotFoundVisible={Boolean(offers.length)}
                    />
                </ContentFulLayout>
                <MarketplaceCartButton />
            </ClientOnly>
        </Layout>
    );
};

export default MarketplaceView;

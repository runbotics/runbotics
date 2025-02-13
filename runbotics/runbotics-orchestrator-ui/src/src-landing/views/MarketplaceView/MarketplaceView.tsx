import { FC, useState } from 'react';

import Image from 'next/image';

import { Industry, MarketplaceOffer, Page, Tag } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import Layout from '#src-landing/components/Layout';
import Typography from '#src-landing/components/Typography';
import ContentFulLayout from 'src/src-landing/components/ContentFulLayout';

import styles from './MarketplaceView.module.scss';
import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';
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
                baseImage={'marketplace-banner'}
                baseImageContent={'Marketplace'}
            >
                <BreadcrumbsSection/>
                <button onClick={() => setFilterDisplayed(true)} className={styles.filter}>
                    <Image alt="filterIcon" src={'/images/icons/filter.svg'} fill={true}/>
                </button>
                <div>
                    place for filters section
                </div>
                <If condition={Boolean(offers.length)} else={offersNotFoundInfo}>
                    <CardsSection
                        posts={[]}
                        featuredPost={null}
                        page={page}
                    />
                </If>
            </ContentFulLayout>
        </Layout>
    );
};

export default MarketplaceView;

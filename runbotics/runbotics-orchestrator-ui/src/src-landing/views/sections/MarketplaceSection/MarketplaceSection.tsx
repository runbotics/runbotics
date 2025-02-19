import { useEffect, type VFC } from 'react';

import { MarketplaceOffer } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { ENTERED_PAGE } from '#src-app/utils/Mixpanel/types';
import { recordPageEntrance } from '#src-app/utils/Mixpanel/utils';
import LinkButton from '#src-landing/components/LinkButton';
import Typography from '#src-landing/components/Typography';
import { MARKETPLACE_SECTION_ID } from '#src-landing/utils/utils';

import MarketplaceOfferCarousel from '#src-landing/views/sections/MarketplaceSection/MarketplaceOfferCarousel/MarketplaceOfferCarousel';

import styles from './MarketplaceSection.module.scss';
import { MARKETPLACE_SECTION_TITLE_ID } from './MarketplaceSection.utils';

interface Props {
    offers?: MarketplaceOffer[];
}

const MarketplaceSection: VFC<Props> = ({ offers }) => {
    const { translate } = useTranslations();
    useEffect(() => {
        recordPageEntrance({ enteredPage: ENTERED_PAGE.MARKETPLACE });
    },  []);

    return (
        <section
            id={MARKETPLACE_SECTION_ID}
            aria-labelledby={MARKETPLACE_SECTION_TITLE_ID}
        >
            <div className={styles.marketplaceTitle}>
                <Typography className={styles.mainTitle} variant="h2" id={MARKETPLACE_SECTION_TITLE_ID}>
                    {translate('Landing.Marketplace.Title.Part.1')}
                </Typography>
                <Typography className={styles.subtitle} variant="h6">
                    {translate('Landing.Marketplace.Title.Part.2')}
                </Typography>
                <div className={styles.blogButtonWrapper}>
                    <LinkButton href={'/marketplace'} title={translate('Landing.Marketplace.Link.Title')} />
                </div>
            </div>
            <div className={styles.background}></div>
            <If condition={offers.length > 0}>
                <MarketplaceOfferCarousel offers={offers}/>
            </If>
        </section>
    );
};

export default MarketplaceSection;

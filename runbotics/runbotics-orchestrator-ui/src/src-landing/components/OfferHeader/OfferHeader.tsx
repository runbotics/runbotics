import { VFC } from 'react';

import Image from 'next/image';

import { MarketplaceOffer } from '#contentful/common';
import HeaderImage from '#public/images/banners/hero-background.png';
import InformationalTag from '#src-landing/components/InformationalTag';

import MarketplaceBackToMainPageButton from '#src-landing/components/MarketplaceBackToMainPageButton';

import styles from './OfferHeader.module.scss';
import Typography from '../Typography';

type Props = Omit<
    MarketplaceOffer,
    'slug' | 'summary' | 'body' | 'description' | 'status' | 'tags'
>;

const OfferHeader: VFC<Props> = ({ title, industries }) => (
    <div className={styles.wrapper}>
        <MarketplaceBackToMainPageButton page={'details'} />
        <Image
            className={styles.featuredImage}
            src={HeaderImage}
            alt={'HeaderImage'}
            fill
        />
        <div className={styles.info}>
            <div className={styles.offerTitle}>
                <Typography variant="h1">
                    {title}
                </Typography>
            </div>
            <div className={styles.details}>
                <div className={styles.tagContainer}>
                    {industries.items.map((industry, idx) => (
                        <>
                            <InformationalTag key={industry.slug}
                                text={industry.title} />
                            {idx !== industries.items.length - 1 && <div className={styles.separator} />}
                        </>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default OfferHeader;

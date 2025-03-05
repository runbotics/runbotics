import { VFC } from 'react';

import Image from 'next/image';

import { MarketplaceOffer } from '#contentful/common';
import HeaderImage from '#public/images/banners/hero-background.png';

import InformationalTag from '#src-landing/components/InformationalTag';

import styles from './OfferHeader.module.scss';
import Typography from '../Typography';

type Props = Omit<
    MarketplaceOffer,
    'slug' | 'summary' | 'body' | 'description' | 'status'
>;

const OfferHeader: VFC<Props> = ({ title, industries, tags }) => (
    <div className={styles.wrapper}>
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
                    {tags.items.map(tag => <InformationalTag key={tag.slug} text={tag.name}/>)}
                </div>
                <div className={styles.separator} />
                <div className={styles.tagContainer}>
                    {industries.items.map(industry => <InformationalTag key={industry.slug}
                        text={industry.title}/>)}
                </div>
            </div>
        </div>
    </div>
);

export default OfferHeader;

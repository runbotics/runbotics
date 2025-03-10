import React, { FC } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { MarketplaceOffer } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import { CLICKABLE_ITEM } from '#src-app/utils/Mixpanel/types';
import { identifyPageByUrl, recordItemClick } from '#src-app/utils/Mixpanel/utils';

import InformationalTag from '#src-landing/components/InformationalTag';

import styles from './MarketplaceCard.module.scss';
import Typography from '../Typography';

interface MarketplaceCardProps {
    offer: MarketplaceOffer;
    className?: string;
}

export const cutText = (text: string, length: number) => {
    if (!text) return null;
    if (text.trim().length < length) {
        return text;
    }
    const cut = text.substring(0, length);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.substring(0, lastSpace) + '...';
};

const MarketplaceCard: FC<MarketplaceCardProps> = ({ offer, className }) => {
    const { translate } = useTranslations();
    const { pathname } = useRouter();
    return (
        <article className={`${styles.root} ${className}`}>
            <Link
                className={styles.link}
                onClick={() => recordItemClick({
                    sourcePage: identifyPageByUrl(pathname),
                    itemName: CLICKABLE_ITEM.MARKETPLACE_OFFER,
                    extraProperties: {
                        title: offer.slug,
                    },
                })}
                href={`/marketplace/offer/${offer.slug}`}>
                <div className={styles.wrapper}>
                    <div className={styles.info}>
                        {offer.tags?.items.length > 0 &&
                                offer.industries.items.filter(industry => Boolean( industry)).slice(0, 3).map((industry) => (
                                    <InformationalTag text={industry.title} key={industry.slug} />
                                ))}
                    </div>
                    <div className={styles.content}>
                        <Typography variant="h4" className={styles.title}>
                            {offer.title}
                        </Typography>
                        <Typography variant="body3" className={styles.contentDescription}>
                            {cutText(offer.description, 180)}
                        </Typography>
                    </div>
                    <div className={styles.addToCart}>
                        <button className={styles.addToCartButton} disabled>
                            <Typography variant="body3">
                                {translate('Marketplace.Card.AddToCart')}
                            </Typography>
                        </button>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default MarketplaceCard;

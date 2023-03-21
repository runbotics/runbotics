import React, { FC } from 'react';

import Image from 'next/image';

import partnerBackground from '#public/images/banners/partner-background.png';
import partnerArrows from '#public/images/shapes/partner-arrows.png';
import { PARTNER_SECTION_ID } from '#src-landing/utils/utils';

import { PARTNER_TITLE_ID } from '../PartnerSection.utils';
import styles from './PartnerBackground.module.scss';

const PartnerBackground: FC = ({ children }) => (
    <section className={styles.root} id={PARTNER_SECTION_ID} aria-labelledby={PARTNER_TITLE_ID}>
        <div className={styles.contentBackground}>
            {children}
        </div>
        <div className={styles.arrowWrapper}>
            <Image
                src={partnerBackground}
                className={styles.arrowBackground}
                alt=""
                fill
                quality={35}
            />
            <Image
                src={partnerArrows}
                className={styles.arrows}
                alt=""
                fill
                quality={35}
            />
        </div>
    </section>
);

export default PartnerBackground;

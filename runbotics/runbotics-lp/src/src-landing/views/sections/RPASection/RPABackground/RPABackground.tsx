import { FC, ReactNode } from 'react';

import Image from 'next/image';

import styles from './RPABackground.module.scss';

import { RPA_TITLE_ID } from '../RPASection.utils';

import circuitsBackground from '#public/images/banners/circuits-background.png';
import { RPA_SECTION_ID } from '#src-landing/utils/utils';

interface RPABackgroundProps {
    children?: ReactNode;
}

const RPABackground: FC<RPABackgroundProps> = ({ children }) => (
    <section className={styles.root} id={RPA_SECTION_ID} aria-labelledby={RPA_TITLE_ID}>
        <Image
            className={styles.circuitsBackground}
            src={circuitsBackground}
            alt=""
            fill
            quality={1}
        />
        <div className={styles.wrapper}>
            <div className={styles.rightColumn}>
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </div>
        </div>
    </section>
);

export default RPABackground;

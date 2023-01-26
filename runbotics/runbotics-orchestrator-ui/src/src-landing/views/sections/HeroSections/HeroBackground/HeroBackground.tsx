import { FC } from 'react';

import Image from 'next/image';

import backgroundImageSrc from '#public/images/banners/hero-background.png';
import heroTitleSrc from '#public/images/runBoticsLogo/hero-RunBotics.png';
import heroArchSrc from '#public/images/shapes/hero-arch.svg';

import { HERO_SECTION_ID } from '#src-landing/utils/utils';

import { HERO_TITLE_ID } from '../HeroSection.utils';
import styles from './HeroBackground.module.scss';

const HeroBackground: FC = ({ children }) => (
    <section className={styles.root} id={HERO_SECTION_ID} aria-labelledby={HERO_TITLE_ID}>
        <Image
            fill
            src={backgroundImageSrc}
            placeholder="blur"
            className={styles.heroBackground}
            alt=""
        />
        <div className={styles.heroArchWrapper}>
            <Image src={heroArchSrc} className={styles.heroArch} alt="" />
        </div>
        {children}
        <div className={styles.heroFooter}>
            {/* using div with background image to take advantage of background-position */}
            <div className={styles.heroArrows} />
            <div className={styles.heroTitleWrapper}>
                <Image
                    src={heroTitleSrc}
                    className={styles.heroTitle}
                    alt="RunBotics text"
                />
            </div>
        </div>
    </section>
);

export default HeroBackground;

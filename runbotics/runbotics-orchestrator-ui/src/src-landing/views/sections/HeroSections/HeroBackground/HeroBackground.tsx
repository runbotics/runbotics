import { FC } from 'react';

import Image from 'next/image';

import heroArchSrc from '#public/images/hero-arch.svg';
import backgroundImageSrc from '#public/images/hero-background.png';
import heroTitleSrc from '#public/images/hero-RunBotics.png';

import styles from './HeroBackground.module.scss';

const HeroBackground: FC = ({ children }) => (
    <section className={styles.root} id="hero-section">
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

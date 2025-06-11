import { FC } from 'react';

import Image from 'next/image';

import heroTitleSrc from '#public/images/runBoticsLogo/hero-RunBotics.png';
import heroHand from '#public/images/shapes/hero_hand.png';
import heroRobotHand from '#public/images/shapes/hero_robotic_hand.png';

import { HERO_SECTION_ID } from '#src-landing/utils/utils';

import styles from './HeroBackground.module.scss';
import { HERO_TITLE_ID } from '../HeroSection.utils';

const HeroBackground: FC = ({ children }) => (
    <section className={styles.root} id={HERO_SECTION_ID} aria-labelledby={HERO_TITLE_ID}>
        <div className={styles.heroHandWrapper}>
            <Image src={heroHand} className={styles.heroHand} alt="" />
            <Image src={heroRobotHand} className={styles.heroRobotHand} alt="" />
        </div>
        <div className={styles.heroContent}>
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
        </div>
    </section>
);

export default HeroBackground;

import React, { FC } from 'react';

import SectionContent from '#src-landing/components/SectionContent/SectionContent';
import Typography from '#src-landing/components/Typography';

import { HeroSectionsProps } from './HeroSection.types';
import styles from './HeroSections.module.scss';
const HeroSection: FC<HeroSectionsProps> = () => (
    <section>
        <SectionContent>
            <Typography variant='h1' font='Roboto'>HeroSection</Typography>
            <Typography variant='h2' color='accent' className={styles.custom}>
              Color test
            </Typography>
        </SectionContent>
    </section>
);

export default HeroSection;

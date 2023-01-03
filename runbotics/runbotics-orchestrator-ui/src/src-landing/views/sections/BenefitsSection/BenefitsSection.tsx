import { FC } from 'react';

import { BENEFITS_SECTION_ID } from '#src-landing/utils/utils';

import BenefitsCarusel from './BenefitsCarusel';
import BenefitsContent from './BenefitsContent';

import styles from './BenefitsSection.module.scss';

const BenefitsSection: FC = () => (
    <section className={styles.root} id={BENEFITS_SECTION_ID}>
        <BenefitsContent />
        <BenefitsCarousel />
    </section>
);

export default BenefitsSection;

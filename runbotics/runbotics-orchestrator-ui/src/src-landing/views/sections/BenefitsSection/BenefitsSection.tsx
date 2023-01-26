import { FC } from 'react';

import { BENEFITS_SECTION_ID } from '#src-landing/utils/utils';

import BenefitsCarousel from './BenefitsCarousel';
import BenefitsContent from './BenefitsContent';

import styles from './BenefitsSection.module.scss';
import { BENEFITS_TITLE_ID } from './BenefitsSection.utils';

const BenefitsSection: FC = () => (
    <section className={styles.root} id={BENEFITS_SECTION_ID} aria-labelledby={BENEFITS_TITLE_ID}>
        <BenefitsContent />
        <BenefitsCarousel />
    </section>
);

export default BenefitsSection;

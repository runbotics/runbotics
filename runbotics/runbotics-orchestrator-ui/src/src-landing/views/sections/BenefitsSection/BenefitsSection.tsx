import { FC } from 'react';

import BenefitsCarousel from './BenefitsCarousel';
import BenefitsContent from './BenefitsContent';

import styles from './BenefitsSection.module.scss';

const BenefitsSection: FC = () => (
    <section className={styles.root} id="benefits-section">
        <BenefitsContent />
        <BenefitsCarousel />
    </section>
);

export default BenefitsSection;

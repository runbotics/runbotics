import React, { FC } from 'react';

import BenefitsCarusel from './BenefitsCarusel';
import BenefitsContent from './BenefitsContent';

import styles from './BenefitsSection.module.scss';

const BenefitsSection: FC = () => (
    <section className={styles.root}>
        <BenefitsContent />
        <BenefitsCarusel />
    </section>
);

export default BenefitsSection;

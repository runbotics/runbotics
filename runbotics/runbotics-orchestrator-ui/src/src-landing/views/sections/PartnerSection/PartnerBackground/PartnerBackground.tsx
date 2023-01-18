import React, { FC } from 'react';

import { PARTNER_SECTION_ID } from '#src-landing/utils/utils';

import styles from './PartnerBackground.module.scss';

const PartnerBackground: FC = ({ children }) => (
    <section className={styles.root} id={PARTNER_SECTION_ID}>
        <div className={styles.contentBackground}>{children}</div>
        <div className={styles.arrowBackground}>
            <div className={styles.arrows} />
        </div>
    </section>
);

export default PartnerBackground;

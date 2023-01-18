import React, { FC } from 'react';

import { OPEN_SOURCE_SECTION_ID } from '#src-landing/utils/utils';

import styles from './OpenSourceBackground.module.scss';

const OpenSourceBackground: FC = ({ children }) => (
    <section className={styles.root} id={OPEN_SOURCE_SECTION_ID}>
        <div className={styles.backgroundBanner}>
            {children}
        </div>
    </section>
);

export default OpenSourceBackground;

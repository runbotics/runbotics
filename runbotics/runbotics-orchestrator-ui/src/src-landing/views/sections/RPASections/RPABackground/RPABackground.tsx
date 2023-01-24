import { FC } from 'react';

import { RPA_SECTION_ID } from '#src-landing/utils/utils';

import styles from './RPABackground.module.scss';

const RPABackground: FC = ({ children }) => (
    <section className={styles.root} id={RPA_SECTION_ID}>
        <div className={styles.centered}>
            <div className={styles.rightColumn}>
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </div>
        </div>
    </section>
);

export default RPABackground;

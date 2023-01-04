import { FC } from 'react';

import { RPA_SECTION_ID } from '#src-landing/utils/utils';

import styles from './RPABackground.module.scss';

const RPABackground: FC = ({children}) => (
    <section className={styles.root} id={RPA_SECTION_ID}>
        <div className={styles.backgroundBanner}>
            <div className={styles.backgroundDimmer} />
            <div className={styles.threeArrows} />
            {children}
            <div className={styles.oneArrow}/>
        </div>
    </section>
);

export default RPABackground;

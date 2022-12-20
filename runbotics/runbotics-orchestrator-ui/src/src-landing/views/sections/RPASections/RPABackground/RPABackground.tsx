import { FC } from 'react';

import styles from './RPABackground.module.scss';

const RPABackground: FC = ({children}) => (
    <section className={styles.root}>
        <div className={styles.backgroundBanner}>
            <div className={styles.backgroundDimmer} />
            <div className={styles.threeArrows} />
            {children}
            <div className={styles.oneArrow}/>
        </div>
    </section>
);

export default RPABackground;

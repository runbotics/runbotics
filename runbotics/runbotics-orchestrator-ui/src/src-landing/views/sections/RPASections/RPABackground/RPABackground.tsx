import { FC } from 'react';

import styles from './RPABackground.module.scss';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { RPA_SECTION_ID } from '#src-landing/utils/utils';

const RPABackground: FC = ({ children }) => {
    const { translate } = useTranslations();

    return (
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
};

export default RPABackground;

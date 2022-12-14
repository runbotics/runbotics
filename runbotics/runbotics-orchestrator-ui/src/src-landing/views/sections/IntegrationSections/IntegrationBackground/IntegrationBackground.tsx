import { FC } from 'react';

import Image from 'next/image';

import arrowRightSrc from '#public/images/shapes/arrows-right-bottom-rounded-transparent-light.svg';

import { INTEGRATION_SECTION_ID } from '#src-landing/utils/utils';

import styles from './IntegrationBackground.module.scss';

const IntegrationBackground: FC = ({children}) => (
    <section className={styles.root} id={INTEGRATION_SECTION_ID}>
        <div className={styles.arrowIconWrapper}>
            <Image
                src={arrowRightSrc}
                className={styles.arrowIcon}
                alt="arrow right"
            />
        </div>
        {children}
    </section>
);

export default IntegrationBackground;

import { FC, ReactNode } from 'react';

import Image from 'next/image';

import styles from './IntegrationBackground.module.scss';

import { INTEGRATIONS_TITLE_ID } from '../IntegrationSection.utils';

import arrowRightSrc from '#public/images/shapes/arrows-right-bottom-rounded-transparent-light.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import { INTEGRATION_SECTION_ID } from '#src-landing/utils/utils';

interface IntegrationBackgroundProps {
    children?: ReactNode;
}

const IntegrationBackground: FC<IntegrationBackgroundProps> = ({ children }) => {
    const { translate } = useTranslations();

    return (
        <section className={styles.root} id={INTEGRATION_SECTION_ID} aria-labelledby={INTEGRATIONS_TITLE_ID}>
            <div className={styles.arrowIconWrapper}>
                <Image
                    src={arrowRightSrc}
                    className={styles.arrowIcon}
                    alt={translate('Landing.Integration.Image.ArrowRight')}
                />
            </div>
            {children}
        </section>
    );
};

export default IntegrationBackground;

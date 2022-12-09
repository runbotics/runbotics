import { FC } from 'react';

import Image from 'next/image';

import arrowRightSrc from '#public/images/shapes/arrows-right-bottom-rounded-transparent-light.svg';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './IntegrationSections.module.scss';


const IntegrationSection: FC = () => {
    const { translate } = useTranslations();

    return (
        <section className={styles.root}>
            <div className={styles.arrowIconWrapper}>
                <Image
                    src={arrowRightSrc}
                    className={styles.arrowIcon}
                    alt="arrow right"
                />
            </div>
            <div className={styles.centeredWrapper}>
                <Typography className={styles.title}>
                    {translate('Landing.Integration.Title.Part.1')}
                    {' '}
                    <span className={styles.fontDark}>
                        {translate('Landing.Integration.Title.Part.2')}
                    </span>
                    {' '}
                    {translate('Landing.Integration.Title.Part.3')}
                </Typography>
                <div className={styles.logosGrid}>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        </section>
    );
};

export default IntegrationSection;

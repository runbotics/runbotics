import { FC } from 'react';

import Image from 'next/image';

import beeOfficeLogoSrc from '#public/images/logos/bee-office-logo.svg';
import excelLogoSrc from '#public/images/logos/excel-logo.svg';
import googleSheetsLogoSrc from '#public/images/logos/google-sheets-logo-NON-COMMERCIAL.svg';
import powerpointLogoSrc from '#public/images/logos/powerpoint-logo.svg';
import SAPLogoSrc from '#public/images/logos/sap-logo.svg';
import sharepointLogoSrc from '#public/images/logos/sharepoint-logo.svg';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './IntegrationSections.module.scss';


const IntegrationSection: FC = () => {
    const { translate } = useTranslations();

    return (
        <section className={styles.root}>
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
                    <Image
                        src={beeOfficeLogoSrc}
                        className={styles.logoIcon}
                        alt="Bee Office logo"
                    />
                    <Image
                        src={excelLogoSrc}
                        className={styles.logoIcon}
                        alt="Excel logo"
                    />
                    <Image
                        src={googleSheetsLogoSrc}
                        className={styles.logoIcon}
                        alt="Google Sheets logo"
                    />
                    <Image
                        src={powerpointLogoSrc}
                        className={styles.logoIcon}
                        alt="PowerPoint logo"
                    />
                    <Image
                        src={SAPLogoSrc}
                        className={styles.logoIcon}
                        alt="SAP logo"
                    />
                    <Image
                        src={sharepointLogoSrc}
                        className={styles.logoIcon}
                        alt="SharePoint logo"
                    />
                </div>
            </div>
        </section>
    );
};

export default IntegrationSection;

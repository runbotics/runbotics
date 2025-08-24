import { FC } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './IntegrationContent.module.scss';
import { INTEGRATIONS_TITLE_ID } from '../IntegrationSection.utils';

const IntegrationSection: FC = () => {
    const { translate } = useTranslations();

    return (
        <div className={styles.root}>
            <Typography variant="h2" id={INTEGRATIONS_TITLE_ID} className={styles.title}>
                {translate('Landing.Integration.Title.Part.1')}
                &nbsp;
                <span className={styles.fontDark}>
                    {translate('Landing.Integration.Title.Part.2')}
                </span>
                &nbsp;
                {translate('Landing.Integration.Title.Part.3')}
            </Typography>
            <div className={styles.logosGrid}>
                <div className={styles.sapLogo}/>
                <div className={styles.beeofficeLogo}/>
                <div className={styles.jiraLogo}/>
                <div className={styles.asanaLogo}/>
                <div className={styles.sharepointLogo}/>
                <div className={styles.googlesheetsLogo}/>
                <div className={styles.excelLogo}/>
                <div className={styles.powerpointLogo}/>
            </div>
        </div>
    );
};

export default IntegrationSection;


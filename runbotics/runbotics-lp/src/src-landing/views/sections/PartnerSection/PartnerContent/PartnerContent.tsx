import React from 'react';


import Image from 'next/image';

import a41Logo from '#public/images/logos/all-for-one-logo.png';
import useTranslations from '#src-app/hooks/useTranslations';
import LinkButton from '#src-landing/components/LinkButton';
import Typography from '#src-landing/components/Typography';
import { CONTACT_US_SECTION_ID } from '#src-landing/utils/utils';

import styles from './PartnerContent.module.scss';
import { PARTNER_TITLE_ID } from '../PartnerSection.utils';

const PartnerContent = () => {
    const { translate } = useTranslations();
    return (
        <div className={styles.content}>
            <Typography id={PARTNER_TITLE_ID} variant="h3" color="secondary">
                {translate('Landing.Partner.Title.Part.1')}
            </Typography>
            <Image src={a41Logo} className={styles.logo} alt="" />
            <div className={styles.partnerLayout}>
                <Typography variant="h3" color="secondary">
                    {translate('Landing.Partner.Title.Part.2')}
                </Typography>
                <div className={styles.btnSpace}>
                    <LinkButton
                        href={`#${CONTACT_US_SECTION_ID}`}
                        title={translate('Landing.Partner.Button.Text')}
                    />
                </div>
                <Typography variant="body2" color="secondary">
                    {translate('Landing.Partner.Subtitle.Part.1')} 
                    <br />
                    {translate('Landing.Partner.Subtitle.Part.2')}
                </Typography>
            </div>
        </div>
    );
};

export default PartnerContent;

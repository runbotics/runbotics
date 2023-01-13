import React from 'react';


import Image from 'next/image';

import a41Logo from '#public/images/logos/all-for-one-logo.png';
import forwardArrow from '#public/images/shapes/forwards-arrow.svg';
import { translate } from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { CONTACT_US_SECTION_ID } from '#src-landing/utils/utils';

import styles from './PartnerContent.module.scss';

const PartnerContent = () => (
    <div className={styles.content}>
        <Typography variant="h3" color="secondary">
            {translate('Landing.Partner.Title.Part.1')}
        </Typography>
        <Image src={a41Logo} className={styles.logo} alt="" />
        <div className={styles.partnerLayout}>
            <Typography variant="h3" color="secondary">
                {translate('Landing.Partner.Title.Part.2')}
            </Typography>
            <div className={styles.btnSpace}>
                <a href={`#${CONTACT_US_SECTION_ID}`} className={styles.btn}>
                    <span className={styles.circle}>
                        <Image src={forwardArrow} alt="" />
                    </span>
                    <Typography variant="h5" className={styles.btnText}>
                        {translate('Landing.Partner.Button.Text')} 
                    </Typography>
                </a>
            </div>
            <Typography variant="body2" color="secondary">
                {translate('Landing.Partner.Subtitle.Part.1')} 
                <br />
                {translate('Landing.Partner.Subtitle.Part.2')}
            </Typography>
        </div>
    </div>
);

export default PartnerContent;

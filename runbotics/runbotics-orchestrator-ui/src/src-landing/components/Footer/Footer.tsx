import { FC } from 'react';


import { Typography } from '@mui/material';
import Image from 'next/image';

import runboticsLogoSrc from '#public/images/runBoticsLogo/logo-mini-sqr.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './Footer.module.scss';
import Navbar from '../Navbar';

const Footer: FC = () => {
    const { translate } = useTranslations();
    const currentYear = new Date().getFullYear();

    const handleScrollTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div className={styles.logo}>
                    <Image src={runboticsLogoSrc} alt="RunBotics logo" />
                </div>
                <Navbar isNavExpanded={false} isMobileVisible={true} />
                <button className={styles.scrollTop} onClick={handleScrollTop}>
                    <div className={styles.arrow} />
                    <Typography className={styles.verticalText} variant="h5">{translate('Landing.Footer.ScrollTop')}</Typography>
                </button>
            </div>
            <div className={styles.divider} />
            <div className={styles.copyright}>
                <Typography>
                    {currentYear} &copy; RunBotics
                </Typography>
            </div>
        </div>
    );
};

export default Footer;


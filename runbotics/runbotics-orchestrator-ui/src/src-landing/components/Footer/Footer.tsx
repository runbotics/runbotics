import { FC } from 'react';


import { Typography } from '@mui/material';
import Image from 'next/image';

import runboticsLogoSrc from '#public/images/runBoticsLogo/logo-mini-sqr.svg';

import Navbar from '../Navbar';
import styles from './Footer.module.scss';

const Footer: FC = () => {
    const scrollTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div className={styles.logo}>
                    <Image src={runboticsLogoSrc} alt="RunBotics logo" />
                </div>
                <Navbar isNavExpanded={false} isMobileVisible={true} />
                <button className={styles.scroll} onClick={scrollTop}>
                    <div className={styles.arrow} />
                    <Typography className={styles.verticalText} variant="h5">scroll to</Typography>
                </button>
            </div>
            <div className={styles.divider} />
            <div className={styles.copyright}>
                <Typography>
                    2022 &copy; RunBotics.com
                </Typography>
            </div>
        </div>
    );
};

export default Footer;


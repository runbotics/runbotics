import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import logo from '#public/images/runBoticsLogo/logo-black-simp.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { MAIN_CONTENT_ID } from '#src-landing/utils/utils';

import Navbar from '../Navbar';

import styles from './Header.module.scss';

const Header = () => {
    const { translate } = useTranslations();

    const [isNavExpanded, setIsNavExpanded] = useState(false);
    
    const headerEl = document.querySelector(`.${styles.header}`);

    const toggleNav = () => {
        setIsNavExpanded((prevState) => !prevState);

        if (headerEl) {
            if (!isNavExpanded) {
                headerEl.classList.add(styles.isActive);
            } else {
                headerEl.classList.remove(styles.isActive);
            }
        }
    };

    const hideNav = () => {
        if (isNavExpanded) {
            setIsNavExpanded(false);
            headerEl.classList.remove(styles.isActive);
        }
    };

    const handleFocus = () => {
        document.getElementById(MAIN_CONTENT_ID).focus();
    };

    const iconMobileStyle = isNavExpanded ? styles.isActive : '';

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Image
                    src={logo}
                    className={styles.logo}
                    alt="RunBotics logo"
                />
                <Link className={styles.skipNavLink} href={`#${MAIN_CONTENT_ID}`} onClick={handleFocus}>
                    <Typography
                        variant="h6"
                        color="secondary"
                        className={styles.btnText}
                        text={translate('Landing.Header.Button.SkipNav')}
                    />
                </Link>
                {/* <button
                    className={`${styles.menuIcon} ${iconMobileStyle}`}
                    onClick={toggleNav}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button> */}
                <button
                    className={`${styles.menuIcon} ${iconMobileStyle}`}
                    onClick={toggleNav}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <Navbar isNavExpanded={isNavExpanded} hideNav={hideNav} isMobileVisible={false}/>
                <Link className={styles.logInBtn} href="/login">
                    <Typography
                        variant="h6"
                        color="accent"
                        className={styles.btnText}
                        text={translate('Landing.Header.Button.LogIn')}
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;

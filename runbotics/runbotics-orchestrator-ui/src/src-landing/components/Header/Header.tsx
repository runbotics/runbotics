import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import logo from '#public/images/runBoticsLogo/logo-black-simp.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import Navbar from '../Navbar';

import styles from './Header.module.scss';

const Header = () => {
    const { translate } = useTranslations();

    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const toggleNav = () => {
        setIsNavExpanded((prevState) => !prevState);
    };

    const hideNav = () => {
        if (isNavExpanded) {
            setIsNavExpanded(false);
        }
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
                <button
                    className={`${styles.menuIcon} ${iconMobileStyle}`}
                    onClick={toggleNav}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <Navbar isNavExpanded={isNavExpanded} hideNav={hideNav} isMobileVisible={false}/>
                <Link href="/login" className={styles.logInBtn}>
                    <Typography
                        variant="h6"
                        color="accent"
                        className={styles.btnText}
                        text={translate('Landing.Header.Nav.Button.LogIn')}
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import logo from '#public/images/runBoticsLogo/logo-black-simp.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { MAIN_CONTENT_ID } from '#src-landing/utils/utils';

import Navbar from '../Navbar';

import styles from './Header.module.scss';

const Header = () => {
    const { translate } = useTranslations();

    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const { push } = useRouter();

    const toggleNav = () => {
        setIsNavExpanded((prevState) => !prevState);
    };

    const hideNav = () => {
        if (isNavExpanded) {
            setIsNavExpanded(false);
        }
    };

    const handleFocus = () => {
        document.getElementById(MAIN_CONTENT_ID).focus();
    };

    const iconMobileStyle = isNavExpanded ? styles.isActive : '';

    return (
        <header className={`${styles.header} ${!isNavExpanded ? '' : styles.isActive}`}>
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
                <button
                    className={`${styles.menuIcon} ${iconMobileStyle}`}
                    onClick={toggleNav}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <Navbar isNavExpanded={isNavExpanded} hideNav={hideNav} isMobileVisible={false}/>
                <button className={styles.loginButton} onClick={() => push('/login')}>
                    <Typography
                        variant="h6"
                        color="accent"
                        className={styles.btnText}
                        text={translate('Landing.Header.Button.LogIn')}
                    />
                </button>
            </div>
        </header>
    );
};

export default Header;

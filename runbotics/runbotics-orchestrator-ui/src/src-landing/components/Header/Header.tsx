import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import logo from '#public/images/runBoticsLogo/logo-black-simp.svg';
import { translate } from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import {
    BENEFITS_SECTION_ID,
    INTEGRATION_SECTION_ID,
    INDUSTRY_SECTORS_SECTION_ID,
    RPA_SECTION_ID,
    PARTNER_SECTION_ID,
    TEMPLATE_SECTION_ID,
    CONTACT_US_SECTION_ID,
} from '#src-landing/utils/utils';

import styles from './Header.module.scss';

const Header = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const toggleNav = () => {
        setIsNavExpanded((prevState) => !prevState);
    };

    const hideNav = () => {
        if (isNavExpanded) {
            setIsNavExpanded(false);
        }
    };

    const navMobileStyle = isNavExpanded
        ? styles.navLinksExpanded
        : styles.hideNavLinksExpanded;

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
                <nav>
                    <ul
                        className={`${styles.navLinkWrapper} ${navMobileStyle}`}
                    >
                        <li className={styles.listItem}>
                            <Link
                                href={`#${BENEFITS_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate(
                                    'Landing.Header.Nav.Option.RunBotics'
                                )}
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link
                                href={`#${RPA_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate('Landing.Header.Nav.Option.RPA')}
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link
                                href={`#${INDUSTRY_SECTORS_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate('Landing.Header.Nav.Option.ForWho')}
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link
                                href={`#${TEMPLATE_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate(
                                    'Landing.Header.Nav.Option.Resources'
                                )}
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link
                                href={`#${INTEGRATION_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate(
                                    'Landing.Header.Nav.Option.Integration'
                                )}
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link
                                href={`#${PARTNER_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate(
                                    'Landing.Header.Nav.Option.Partners'
                                )}
                            </Link>
                        </li>
                        <li className={styles.listItem}>
                            <Link
                                href={`#${CONTACT_US_SECTION_ID}`}
                                className={styles.link}
                                onClick={hideNav}
                                scroll={false}
                            >
                                {translate(
                                    'Landing.Header.Nav.Option.ContactUs'
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Link href="/login" className={styles.logInBtn}>
                    <Typography
                        variant="nav"
                        color="accent"
                        text={translate('Landing.Header.Nav.Button.LogIn')}
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;

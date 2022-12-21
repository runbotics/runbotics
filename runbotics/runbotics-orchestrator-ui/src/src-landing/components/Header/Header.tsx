import React, { useState } from 'react';

import Image from 'next/image';


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
    CONTACT_US_SECTION_ID
} from '#src-landing/utils/utils';

import styles from './Header.module.scss';

const Header = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const scroll = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsNavExpanded(false);
    };

    const toggleNav = () => {
        setIsNavExpanded((prevState) => !prevState);
    };

    const navMobileStyle = isNavExpanded
        ? styles['nav-links-expanded']
        : styles['hide-nav-links-expanded'];

    const iconMobileStyle = isNavExpanded ? styles['is-active'] : '';

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Image src={logo} className={styles.logo} alt="RunBotics logo" />
                <button
                    className={`${styles['menu-icon']} ${iconMobileStyle}`}
                    onClick={toggleNav}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav>
                    <ul className={`${styles['nav-links']} ${navMobileStyle}`}>
                        <li onClick={() => scroll(BENEFITS_SECTION_ID)} className={styles['list-item']}>
                            <Typography variant="nav" color="primary" text={translate('Landing.Header.Nav.Option.1')} />
                        </li>
                        <li onClick={() => {scroll(RPA_SECTION_ID)}} className={styles['list-item']}>
                            <Typography variant="nav" color="primary" text={translate('Landing.Header.Nav.Option.2')} />
                        </li>
                        <li onClick={() => {scroll(INDUSTRY_SECTORS_SECTION_ID)}} className={styles['list-item']}>
                            <Typography variant="nav" color="primary" text={translate('Landing.Header.Nav.Option.3')} />
                        </li>
                        <li onClick={() => {scroll(TEMPLATE_SECTION_ID)}} className={styles['list-item']}>
                            <Typography variant="nav" color="primary" text={translate('Landing.Header.Nav.Option.4')} />
                        </li>
                        <li onClick={() => scroll(INTEGRATION_SECTION_ID)} className={styles['list-item']}>
                            <Typography variant="nav" color="primary" text={translate('Landing.Header.Nav.Option.5')} />
                        </li>
                        <li onClick={() => scroll(PARTNER_SECTION_ID)} className={styles['list-item']}>
                            <Typography variant="nav" color="primary" text={translate('Landing.Header.Nav.Option.6')} />
                        </li>
                        <li onClick={() => {}} className={`${styles['log-in-btn']} ${styles['list-item']}`}>
                            <Typography variant="nav" color="accent" text={translate('Landing.Header.Nav.Button.2')} />
                        </li>
                    </ul>
                </nav>
                <div
                    onClick={() => scroll(CONTACT_US_SECTION_ID)}
                    className={styles['contact-btn']}
                >
                    <Typography variant="nav" color="accent" text={translate('Landing.Header.Nav.Button.1')} />
                </div>
            </div>
        </header>
    );
};

export default Header;

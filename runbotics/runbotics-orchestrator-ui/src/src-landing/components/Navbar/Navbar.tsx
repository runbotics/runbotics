import { FC } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

import {
    BENEFITS_SECTION_ID,
    INTEGRATION_SECTION_ID,
    INDUSTRY_SECTORS_SECTION_ID,
    RPA_SECTION_ID,
    PARTNER_SECTION_ID,
    TEMPLATE_SECTION_ID,
    CONTACT_US_SECTION_ID,
} from '#src-landing/utils/utils';

import styles from './Navbar.module.scss';

import { NavbarProps } from './Navbar.types';

const Navbar: FC<NavbarProps> = ({ 
    isNavExpanded = true, 
    hideNav,
    isMobileVisible
}) => {
    const { translate } = useTranslations();

    const navMobileStyle = isNavExpanded
        ? styles.navLinksExpanded
        : styles.hideNavLinksExpanded;

    return (
        <nav>
            <ul className={`${styles.navLinkWrapper} ${isMobileVisible ? styles.minimized : navMobileStyle}`}>
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
    );
};

export default Navbar;

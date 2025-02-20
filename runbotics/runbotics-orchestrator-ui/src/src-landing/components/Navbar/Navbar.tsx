import { FC } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import {
    BENEFITS_SECTION_ID,
    INTEGRATION_SECTION_ID,
    REFERENCES_SECTION_ID,
    RPA_SECTION_ID,
    PARTNER_SECTION_ID,
    CONTACT_US_SECTION_ID,
    PROS_SECTION_ID,
    OPEN_SOURCE_SECTION_ID,
    TEAM_SECTION_ID,
    BLOG_SECTION_ID,
    MARKETPLACE_SECTION_ID,
} from '#src-landing/utils/utils';

import styles from './Navbar.module.scss';
import { NavbarProps } from './Navbar.types';
import LoginLink from '../Header/LoginLink';

const Navbar: FC<NavbarProps> = ({
    isNavExpanded = true,
    hideNav,
    isMobileVisible,
}) => {
    const { translate } = useTranslations();

    const navMobileStyle = isNavExpanded
        ? styles.navLinksExpanded
        : styles.hideNavLinksExpanded;

    return (
        <nav className={styles.nav}>
            <ul
                className={`${styles.navLinkWrapper} ${
                    isMobileVisible ? styles.minimized : navMobileStyle
                }`}
            >
                <li className={styles.listItem}>
                    <LoginLink/>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${BENEFITS_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.RunBotics')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${RPA_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.RPA')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${PROS_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.Pros')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${OPEN_SOURCE_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.OpenSource')}
                    </Link>
                </li>
                {/* <li className={styles.listItem}>
                    <Link
                        href={`/#${TEMPLATE_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate(
                            'Landing.Header.Nav.Option.Resources'
                        )}
                    </Link>
                </li>
                */}
                <li className={styles.listItem}>
                    <Link
                        href={`/#${INTEGRATION_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.Integration')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${REFERENCES_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.References')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${PARTNER_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.Partners')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${TEAM_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.Team')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${BLOG_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.Blog')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${MARKETPLACE_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.Marketplace')}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${CONTACT_US_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.ContactUs')}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

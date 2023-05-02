import { FC } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';


import {
    BENEFITS_SECTION_ID,
    INTEGRATION_SECTION_ID,
    RPA_SECTION_ID,
    PARTNER_SECTION_ID,
    CONTACT_US_SECTION_ID,
    PROS_SECTION_ID,
    OPEN_SOURCE_SECTION_ID,
    BLOG_PATH,
} from '#src-landing/utils/utils';

import styles from './Navbar.module.scss';

import { NavbarProps } from './Navbar.types';

const Navbar: FC<NavbarProps> = ({ 
    isNavExpanded = true, 
    hideNav,
    isMobileVisible
}) => {
    const { translate } = useTranslations();

    const { query, push } = useRouter();

    const navMobileStyle = isNavExpanded
        ? styles.navLinksExpanded
        : styles.hideNavLinksExpanded;

    return (
        <nav>
            <ul className={`${styles.navLinkWrapper} ${isMobileVisible ? styles.minimized : navMobileStyle}`}>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${BENEFITS_SECTION_ID}`}
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
                        {translate(
                            'Landing.Header.Nav.Option.Pros'
                        )}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${OPEN_SOURCE_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate(
                            'Landing.Header.Nav.Option.OpenSource'
                        )}
                    </Link>
                </li>
                {/* 
                <li className={styles.listItem}>
                    <Link
                        href={`/#${INDUSTRY_SECTORS_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate('Landing.Header.Nav.Option.ForWho')}
                    </Link>
                </li> */}
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
                        {translate(
                            'Landing.Header.Nav.Option.Integration'
                        )}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/#${PARTNER_SECTION_ID}`}
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
                        href={`/#${CONTACT_US_SECTION_ID}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate(
                            'Landing.Header.Nav.Option.ContactUs'
                        )}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <Link
                        href={`/${BLOG_PATH}`}
                        className={styles.link}
                        onClick={hideNav}
                        scroll={false}
                    >
                        {translate(
                            'Landing.Header.Nav.Option.Blog'
                        )}
                    </Link>
                </li>
                <li className={styles.listItem}>
                    <button className={styles.loginButton} onClick={() => push('/login')}>
                        <Typography
                            variant="h6"
                            color="accent"
                            className={styles.btnText}
                            text={translate('Landing.Header.Button.LogIn')}
                        />
                    </button>
                </li>
            </ul>
            
        </nav>
    );
};

export default Navbar;

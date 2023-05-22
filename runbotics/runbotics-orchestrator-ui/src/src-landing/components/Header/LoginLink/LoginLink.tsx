import type { VFC } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './LoginLink.module.scss';

const LoginLink: VFC = () => {
    const { translate } = useTranslations();
    
    return (
        <Link className={styles.link} href={'/login'}>
            <Typography
                variant="h6"
                color="accent"
                className={styles.linkText}
                text={translate('Landing.Header.Button.LogIn')}
            />
        </Link>
    );
};

export default LoginLink;

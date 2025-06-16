import type { VFC } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './LoginLink.module.scss';

interface Props {
    className?: string;
}

const LoginLink: VFC<Props> = ({ className }) => {
    const { translate } = useTranslations();
    const baseUrl = process.env.RUNBOTICS_URL || 'http://localhost:3000';

    return (
        <a className={`${styles.link} ${className}`} href={`${baseUrl}/login`}>
            <Typography
                variant="h6"
                color="accent"
                className={styles.linkText}
                text={translate('Landing.Header.Button.LogIn')}
            />
        </a>
    );
};

export default LoginLink;

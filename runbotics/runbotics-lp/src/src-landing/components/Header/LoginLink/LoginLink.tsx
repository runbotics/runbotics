import type { VFC } from 'react';


import styles from './LoginLink.module.scss';

import { useLocalizedUrl } from '#src-app/hooks/useLocalization';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

interface Props {
    className?: string;
}

const LoginLink: VFC<Props> = ({ className }) => {
    const { translate } = useTranslations();
    const { getLocalizedUrl } = useLocalizedUrl();

    return (
        <a className={`${styles.link} ${className}`} href={getLocalizedUrl('/login')}>
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

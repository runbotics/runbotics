import { FC } from 'react';

import Link from 'next/link';

import styles from './TempLoginButton.module.scss';

import { useLocalizedUrl } from '#src-app/hooks/useLocalization';
import Typography from '#src-landing/components/Typography';

const TempLoginButton: FC = () => {
    const { getLocalizedUrl } = useLocalizedUrl();
    
    return (
        <Link className={styles.root} href={getLocalizedUrl('/login')}>
            <Typography variant="body1" font="Roboto">
                Login
            </Typography>
        </Link>
    );
};

export default TempLoginButton;

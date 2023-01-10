import { FC } from 'react';

import Link from 'next/link';

import Typography from '#src-landing/components/Typography';

import styles from './TempLoginButton.module.scss';

const TempLoginButton: FC = () => (
    <Link className={styles.root} href="/login">
        <Typography variant="body1" font="Roboto">
            Login
        </Typography>
    </Link>
);

export default TempLoginButton;

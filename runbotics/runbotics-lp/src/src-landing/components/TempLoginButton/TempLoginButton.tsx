import { FC } from 'react';

import Link from 'next/link';

import styles from './TempLoginButton.module.scss';

import Typography from '#src-landing/components/Typography';

const TempLoginButton: FC = () => (
    <Link className={styles.root} href="/ui/login">
        <Typography variant="body1" font="Roboto">
            Login
        </Typography>
    </Link>
);

export default TempLoginButton;

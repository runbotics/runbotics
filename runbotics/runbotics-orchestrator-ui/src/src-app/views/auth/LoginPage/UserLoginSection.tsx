import { FC } from 'react';

import { Box, CardContent, Link, Typography } from '@mui/material';
import RouterLink from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

import { classes } from './Login.page';

const UserLoginSection: FC = ({ children }) => {
    const { translate } = useTranslations();

    return (
        <CardContent className={classes.content}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                minHeight={300}
            >
                <Box alignItems="center" display="flex" justifyContent="center" mb={0}>
                    <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="h3"
                        sx={{ fontWeight: 700 }}
                    >
                        {translate('Login.SignIn')}
                    </Typography>
                </Box>
                <Box>{children}</Box>
            </Box>
            <Box display="flex" justifyContent="center" mt={3}>
                <RouterLink href="/register" passHref legacyBehavior>
                    <Link sx={{ textAlign: 'center' }} variant="body2" color="textSecondary">
                        {translate('Login.SwitchToRegisterMessage')}
                    </Link>
                </RouterLink>
            </Box>
        </CardContent>
    );
};

export default UserLoginSection;

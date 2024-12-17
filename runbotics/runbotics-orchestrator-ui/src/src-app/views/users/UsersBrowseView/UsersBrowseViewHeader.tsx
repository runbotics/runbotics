import React, { FC } from 'react';

import { Grid, Typography } from '@mui/material';
import { Role } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';

import { StyledHeaderGrid } from './UsersBrowseView.styles';

const UsersBrowseViewHeader: FC = () => {
    const { translate } = useTranslations();
    const { user }= useAuth();
    const hasAdminAccess = useRole([Role.ROLE_ADMIN]);

    const header = hasAdminAccess
        ? translate('Users.Browse.Header.Title')
        : `${translate('Users.Browse.Header.Title')} | ${user.tenant.name}`;

    return (
        <StyledHeaderGrid
            container
            spacing={3}
        >
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {header}
                </Typography>
            </Grid>
        </StyledHeaderGrid>
    );
};

export default UsersBrowseViewHeader;

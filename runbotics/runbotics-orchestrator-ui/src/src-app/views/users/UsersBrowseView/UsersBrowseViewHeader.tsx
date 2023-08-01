import React, { FC } from 'react';

import { Grid, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledHeaderGrid } from './UsersBrowseView.styles';

const UsersBrowseViewHeader: FC = () => {
    const { translate } = useTranslations();

    return (
        <StyledHeaderGrid
            container
            spacing={3}
            justifyContent="space-between"
        >
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {translate('Users.Browse.Header.Title')}
                </Typography>
            </Grid>
        </StyledHeaderGrid>
    );
};

export default UsersBrowseViewHeader;

import { VFC } from 'react';

import { Grid, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledHeaderGrid } from './TenantsBrowseView.styles';


const TenantsBrowseViewHeader: VFC = () => {
    const { translate } = useTranslations();

    return (
        <StyledHeaderGrid
            container
            spacing={3}
        >
            <Grid item>
                <Typography variant="h3" color="textPrimary">
                    {translate('Tenants.Browse.Header.Title')}
                </Typography>
            </Grid>
        </StyledHeaderGrid>
    );
};

export default TenantsBrowseViewHeader;

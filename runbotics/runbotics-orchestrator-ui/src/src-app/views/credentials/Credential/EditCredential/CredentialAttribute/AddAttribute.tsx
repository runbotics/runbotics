import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CardContent, Typography, Grid } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledAddCard } from './Attribute.styles';

export const AddAttribute = ({ onClick }) => {
    const { translate } = useTranslations();

    return (
        <StyledAddCard onClick={onClick}>
            <CardContent>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <AddCircleOutlineIcon style={{ margin: 'auto', display: 'block' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">
                            {translate('Credential.Attribute.Edit.AddCredential')}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </StyledAddCard>
    );
};

import React from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Card, CardContent, Typography, Grid } from '@mui/material';

import { grey } from '@mui/material/colors';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

export const AddAttribute = ({ onClick }) => {
    const { translate } = useTranslations();

    const StyledAddCard = styled(Card)`
        cursor: pointer;
        min-height: 260px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid ${grey[200]};
        transition: background-color 0.3s ease;

        &:hover {
            background-color: ${grey[100]};
            border: 1px solid ${grey[400]};
        }
    `;

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

// style={{ cursor: 'pointer', minHeight: '480px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}

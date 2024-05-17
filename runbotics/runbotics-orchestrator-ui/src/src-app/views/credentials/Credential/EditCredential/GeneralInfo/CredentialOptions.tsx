import React from 'react';

import { Grid, Button } from '@mui/material';

import { translate } from '#src-app/hooks/useTranslations';

const CredentialOptions: React.FC<{}> = () => (

    <Grid container spacing={2} justifyContent="flex-end" marginTop='16px'>
        <Grid item >
            <Button
                color="secondary"
                variant="outlined">
                {translate('Credential.Add.Cancel')}
            </Button>
        </Grid>
        <Grid item >
            <Button
                color="secondary"
                variant="contained">
                {translate('Credential.Add.Save')}
            </Button>
        </Grid>
    </Grid>
);

export default CredentialOptions;

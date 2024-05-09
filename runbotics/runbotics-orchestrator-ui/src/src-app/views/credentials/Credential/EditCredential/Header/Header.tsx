import React from 'react';

import { Grid } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import CredentialLocation from './CredentialLocation';
import CredentialOptions from './CredentialOptions';

export const Header: React.FC<{}> = () => {
    const { translate } = useTranslations();

    return (
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item>
                <CredentialLocation 
                // collection={collection}
                />
            </Grid>
            <Grid item>
                <CredentialOptions/>
            </Grid>
        </Grid>
    );
};

export default Header;

import React from 'react';

import { Grid } from '@mui/material';

import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

import CredentialLocation from './CredentialLocation';

const StyledGrid = styled(Grid)(({theme}) => `
    margin-bottom: ${theme.spacing(3)};
    spacing: ${theme.spacing(2)};
`);

export const Header: React.FC<{}> = () => {
    const { translate } = useTranslations();

    return (
        <StyledGrid container alignItems="center" justifyContent="space-between">
            <Grid item>
                <CredentialLocation 
                // collection={collection}
                />
            </Grid>
        </StyledGrid>
    );
};

export default Header;

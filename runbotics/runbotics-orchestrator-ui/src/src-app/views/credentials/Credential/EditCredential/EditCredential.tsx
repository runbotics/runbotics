import { FC } from 'react';

import { Grid, Typography } from '@mui/material';

import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

import { translate } from '#src-app/hooks/useTranslations';

import CredentialAttributesList from './CredentialAttributeList/CredentialAttributeList';
import { EditCredentialProps } from './EditCredential.types';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import Header from './Header/Header';

const StyledGrid = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
`
);

const CredentialsInternalPage = styled(InternalPage)`
    padding-top: 0;
    padding-bottom: 0;

    > [class*="MuiContainer"] {
        padding-left: 0;
        padding-right: 0;
    }
`;

const EditCredential: FC<EditCredentialProps> = ({ credential, onAdd, onClose, open }) => (
    <CredentialsInternalPage title={translate('Credential.Add.Title')}>
        <StyledGrid container justifyContent="space-between" my={2} ml={2} display={'flex'} gap={2} >
            <Header />
            <GeneralInfo />
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        {translate('Credential.Attributes.Title')} (3)
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <CredentialAttributesList/>
                </Grid>
            </Grid>
            {/* list of attributes */}
            {/* add attribute */}
        </StyledGrid>
    </CredentialsInternalPage>
);

export default EditCredential;

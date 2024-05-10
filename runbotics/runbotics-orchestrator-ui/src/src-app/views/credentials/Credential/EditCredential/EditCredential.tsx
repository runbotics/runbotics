import { FC } from 'react';

import { Grid, Typography } from '@mui/material';

import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

import { translate } from '#src-app/hooks/useTranslations';

import CredentialAttributesList from './CredentialAttributeList/CredentialAttributeList';
import { EditCredentialProps } from './EditCredential.types';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import CredentialOptions from './Header/CredentialOptions';
import Header from './Header/Header';

const StyledGrid = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(3)};
`
);

const EditCredential: FC<EditCredentialProps> = ({ credential, onAdd, onClose, open }) => (
    <InternalPage title={translate('Credential.Add.Title')}>
        <StyledGrid container justifyContent="space-between" spacing={3}>
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
        <CredentialOptions/>
    </InternalPage>
);

export default EditCredential;

import { FC } from 'react';

import { Grid } from '@mui/material';

import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

import { translate } from '#src-app/hooks/useTranslations';

import { EditCredentialProps } from './EditCredential.types';
import Header from './Header/Header';

const StyledGrid = styled(Grid)(({ theme }) => `
    padding: ${theme.spacing(3)}
`
);

const EditCredential: FC<EditCredentialProps> = ({ credential, onAdd, onClose, open }) => (
    <InternalPage title={translate('Credential.Add.Title')}>
        <StyledGrid container justifyContent="space-between" spacing={3}>
            <Header />
            {/* Header */}
            {/* General Info */}
            {/* list of attributes */}
        </StyledGrid>
    </InternalPage>
);

export default EditCredential;

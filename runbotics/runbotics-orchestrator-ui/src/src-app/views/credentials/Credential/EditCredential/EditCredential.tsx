import { FC, useEffect } from 'react';

import { Grid, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

import { translate } from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { fetchOneCredential } from '#src-app/store/slices/Credentials/Credentials.thunks';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialAttributesList from './CredentialAttributeList/CredentialAttributeList';
import { EditCredentialProps } from './EditCredential.types';
import Header from './Header/Header';
import { ColorNames } from '../../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';
import GeneralInfo from '../GeneralInfo/GeneralInfo';

const StyledGrid = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(1)};
`
);

const CredentialsInternalPage = styled(InternalPage)`
    padding-top: 0;
    padding-bottom: 0;

    > [class*='MuiContainer'] {
        padding-left: 0;
        padding-right: 0;
    }
`;

const EditCredential: FC<EditCredentialProps> = ({}) => {
    const router = useRouter();
    const credentialId = getLastParamOfUrl(router);
    const credentials = useSelector(state => state.credentials.all);
    const credential = credentials.find(cred => cred.id === credentialId);
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const currentCredentialCollection = collections.find(collection => collection.id === credential.collectionId);
    const dispatch = useDispatch();

    useEffect(() => {
        if (credentialId) {
            dispatch(fetchOneCredential({resourceId: credentialId}));
        }
    }, [dispatch, credentialId]);

    return (
        <CredentialsInternalPage title={translate('Credential.Add.Title')}>
            <StyledGrid container justifyContent="space-between" my={2} ml={2} gap={2}>
                <Header credentialName={credential.name} />
                <GeneralInfo credential={credential} collectionColor={currentCredentialCollection.color as ColorNames}/>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4">{translate('Credential.Attributes.Title')} (3)</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CredentialAttributesList templateId={credential.templateId} />
                    </Grid>
                </Grid>
            </StyledGrid>
        </CredentialsInternalPage>
    );
};
export default EditCredential;

import { FC, useEffect } from 'react';

import { Grid, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import InternalPage from '#src-app/components/pages/InternalPage';

import { translate } from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { fetchAllCredentialCollections } from '#src-app/store/slices/CredentialCollections/CredentialCollections.thunks';
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
    const dispatch = useDispatch();
    const credentialId = getLastParamOfUrl(router);

    const credentials = useSelector(state => state.credentials.all);
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const collectionsLoading = useSelector(state => state.credentialCollections.loading);

    const credential = credentials ? credentials.find(cred => cred.id === credentialId) : undefined;
    const currentCredentialCollection = credential ? collections.find(collection => collection.id === credential.collectionId) : undefined;

    useEffect(() => {
        dispatch(fetchOneCredential({ resourceId: credentialId }));
        if (!collections.length) dispatch(fetchAllCredentialCollections());
    }, [credentialId, collections.length]);

    return (
        <>
            {!collectionsLoading && currentCredentialCollection && credential && (
                <CredentialsInternalPage title={translate('Credential.Add.Title')}>
                    <StyledGrid container justifyContent="space-between" my={2} ml={2} gap={2} width={'96%'}>
                        <Header credentialName={credential.name} />
                        <GeneralInfo
                            credential={credential}
                            collectionColor={currentCredentialCollection.color as ColorNames}
                            collectionName={currentCredentialCollection.name}
                        />
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h4">{translate('Credential.Attributes.Title')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <CredentialAttributesList
                                    credential={credential}
                                    templateId={credential.templateId}
                                    isNewCredential={credential.attributes?.length ? true : false}
                                ></CredentialAttributesList>
                            </Grid>
                        </Grid>
                    </StyledGrid>
                </CredentialsInternalPage>
            )}
        </>
    );
};
export default EditCredential;

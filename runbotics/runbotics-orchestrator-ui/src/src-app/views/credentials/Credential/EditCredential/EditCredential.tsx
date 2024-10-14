import { FC, useEffect } from 'react';

import { Grid, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { translate } from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { credentialCollectionsActions, credentialCollectionsSelector } from '#src-app/store/slices/CredentialCollections';
import { credentialsActions, credentialsSelector } from '#src-app/store/slices/Credentials';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import CredentialAttributesList from './CredentialAttribute/CredentialAttributeList';
import { CredentialsInternalPage, StyledGrid } from './EditCredential.styles';
import { isCreatedNow } from './EditCredential.utils';
import GeneralInfo from './GeneralInfo';
import Header from './Header/Header';
import { BasicCredentialDto } from '../Credential.types';

interface EditCredentialProps {
    credential: Credential
    onClose: () => void;
    onAdd: (credential: BasicCredentialDto) => void;
    open?: boolean;
}

const EditCredential: FC<EditCredentialProps> = ({}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const credentialId = getLastParamOfUrl(router);

    const { all: credentials } = useSelector(credentialsSelector);
    const { credentialCollections, loading: collectionsLoading } = useSelector(credentialCollectionsSelector);

    const credential = credentials ? credentials.find(cred => cred.id === credentialId) : undefined;
    const currentCredentialCollection = credential && credentialCollections ? credentialCollections.find(collection => collection.id === credential.collectionId) : undefined;
    const readyToLoadCredential = !collectionsLoading && !!currentCredentialCollection && !!credential;
    const isNewCredential = isCreatedNow(credential?.createdAt);

    useEffect(() => {
        dispatch(credentialsActions.fetchOneCredential({ resourceId: credentialId }));
        if (!credentialCollections) dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
    }, [credentialId, credentialCollections]);

    return (
        <>
            {readyToLoadCredential && (
                <CredentialsInternalPage title={translate('Credential.Title', { name: credential.name })}>
                    <StyledGrid container justifyContent="space-between" my={2} ml={2} gap={2} width={'96%'}>
                        <Header
                            collectionId={credential.collectionId}
                            collectionName={credential.collection.name}
                        />
                        <GeneralInfo
                            credential={credential}
                            collectionColor={currentCredentialCollection.color}
                            collectionName={credential.collection.name}
                        />
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h4">{translate('Credential.Attributes.Title')}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <CredentialAttributesList
                                    credential={credential}
                                    templateId={credential.templateId}
                                    isNewCredential={isNewCredential}
                                    currentCollection={currentCredentialCollection}
                                />
                            </Grid>
                        </Grid>
                    </StyledGrid>
                </CredentialsInternalPage>
            )}
        </>
    );
};
export default EditCredential;

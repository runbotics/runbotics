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

    const { all: credentials} = useSelector(credentialsSelector);
    const { credentialCollections, loading: collectionsLoading } = useSelector(credentialCollectionsSelector);

    const credential = credentials ? credentials.find(cred => cred.id === credentialId) : undefined;
    const currentCredentialCollection = credential ? credentialCollections.find(collection => collection.id === credential.collectionId) : undefined;
    const readyToLoadCredential = !collectionsLoading && Boolean(currentCredentialCollection) && Boolean(credential);

    useEffect(() => {
        dispatch(credentialsActions.fetchOneCredential({ resourceId: credentialId }));
        if (!credentialCollections.length) dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
    }, [credentialId, credentialCollections.length]);

    return (
        <>
            {readyToLoadCredential && (
                <CredentialsInternalPage title={translate('Credential.Add.Title')}>
                    <StyledGrid container justifyContent="space-between" my={2} ml={2} gap={2} width={'96%'}>
                        <Header credentialName={credential.name} collectionId={credential.collectionId}/>
                        <GeneralInfo
                            credential={credential}
                            collectionColor={currentCredentialCollection.color}
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
                                    isNewCredential={Boolean(credential.attributes?.length)}
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

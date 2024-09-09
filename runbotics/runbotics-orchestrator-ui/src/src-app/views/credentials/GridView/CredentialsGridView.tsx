import { useEffect, useState } from 'react';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, SvgIcon, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import CredentialTile from '#src-app/components/Tile/CredentialTile/CredentialTile';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { credentialCollectionsActions } from '#src-app/store/slices/CredentialCollections';
import { credentialsActions } from '#src-app/store/slices/Credentials';
import { credentialTemplatesActions } from '#src-app/store/slices/CredentialTemplates';

import { TileGrid } from './GridView';
import CredentialsHeader from '../Credentials/CredentialsList/CredentialsHeader';


const CredentialsGridView = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const credentials = useSelector(state => state.credentials.all);
    const collections = useSelector(state => state.credentialCollections.credentialCollections);
    const loading = useSelector(state => state.credentials.loading);
    const credentialTemplates = useSelector(state => state.credentialTemplates.data);
    const [currentDialogCredential, setCurrentDialogCredential] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const router = useRouter();
    const collectionId = router.query.collectionId ? (router.query.collectionId as string) : null;

    const handleDeleteDialogOpen = (id: string) => {
        setIsDeleteDialogOpen(true);
        setCurrentDialogCredential(credentials.find(credential => credential.id === id));
    };

    const handleDeleteDialogClose = () => {
        setIsDeleteDialogOpen(false);
        setCurrentDialogCredential(null);
    };

    const handleDelete= () => {
        dispatch(credentialsActions.deleteCredential({resourceId: currentDialogCredential.id })).then(() => {
            enqueueSnackbar(translate('Credential.Tile.Delete.Success', {name: currentDialogCredential.name}), { variant: 'success'});
            handleDeleteDialogClose();
        }).catch((error) => {
            enqueueSnackbar(error ? error.message : translate('Credential.Tile.Delete.Fail', {name: currentDialogCredential.name}), { variant: 'error'});
        });
    };

    useEffect(() => {
        dispatch(credentialCollectionsActions.fetchAllCredentialCollections());
        dispatch(credentialTemplatesActions.fetchAllTemplates());
        collectionId
            ? dispatch(credentialsActions.fetchAllCredentialsInCollection({ resourceId: `${collectionId}/credentials/` }))
            : dispatch(credentialsActions.fetchAllCredentialsAccessibleInTenant());
    }, []);

    const credentialsTiles = credentials.map(credential => (
        <CredentialTile
            key={credential.id}
            credential={credential}
            collection={collections.find(collection => credential.collectionId === collection.id)}
            templateName={credentialTemplates.find(template => template.id === credential.templateId).name}
            collectionName={collections.find(collection => collection.id === credential.collectionId)?.name}
            loading={loading}
            collectionId={collectionId}
            handleDeleteDialogOpen={handleDeleteDialogOpen}
        />
    ));

    console.log(currentDialogCredential);
    return (
        <>
            <If condition={!loading} else={<LoadingScreen/>}>
                {collectionId &&
                <Box display='flex' justifyItems='center' alignItems='center' mb={3} >
                    <SvgIcon fontSize='large' color='secondary'>
                        <FolderOpenIcon />
                    </SvgIcon>
                    <Typography variant='h3' ml={1}>
                        {collections.find(collection => collectionId === collection.id
                        )?.name}
                    </Typography>
                </Box>}
                <CredentialsHeader credentialCount={credentials.length} />
                <TileGrid>{credentialsTiles}</TileGrid>
            </If>
            {currentDialogCredential &&
                <CustomDialog
                    isOpen={isDeleteDialogOpen}
                    title={translate('Credential.Tile.Delete.Warning', { name: currentDialogCredential.name })}
                    onClose={() => handleDeleteDialogClose()}
                    confirmButtonOptions={{ onClick: handleDelete }}
                    cancelButtonOptions={{ onClick: () => handleDeleteDialogClose() }}
                />
            }
        </>
    );
};

export default CredentialsGridView;
